import { Injectable } from '@angular/core';
import { Conversation, Attachment, AttachmentType, MessageOrEvent, Message, Event } from '../models/chat';
import { HttpClient } from '@angular/common/http';
import { API_URL, SITE_URL } from '../constants';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    wallpaperUrl: string;
    conversations: Conversation[];
    socket: SocketIOClient.Socket;

    onlineOfflineUsersChanged = 0;

    users: { [userId: number]: User } = {};

    private _unreadMessages = 0;
    private requestingConversations = false;
    private dontPushAnything = false;
    private dontPushChatIds = [];
    private isBlurred = false;

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private utils: UtilsService
    ) {
        this.socket = (window as any).socket = io(0 || "http://localhost:8080");
        auth.onAuthenticatedListeners.push(() => {
            this.socketAuth();

            http.post(API_URL + "chatWallpaperUrl", {
                token: auth.session.token
            }).subscribe((res: any) => {
                if (res.url) this.wallpaperUrl = res.url;
            });
        });

        this.socket.on("reconnect", () => this.socketAuth());
        this.socket.on("message", (message: Message) => {
            message.justNew = true;
            this.addToConv(message, null);
        });
        this.socket.on("event", e => this.addToConv(null, e));
        this.socket.on("logged out", () => {
            if (auth.loggingOut) return; // logout was expected.

            //logout was unexpected, notify user and reload webapp:
            alert("Je bent uitgelogd.");
            window.location.href = "/";
        });

        this.socket.on(
            "authenticated",
            () => {
                if (this.isBlurred && utils.mobile) return;
                this.socket.emit("online");
            }
        );

        this.socket.on("online", data => {
            var user = this.users[data.userId];
            if (!user) return;
            user.online = true;
            user.lastActivity = data.lastActivity;
            this.onlineOfflineUsersChanged = Date.now();
        });
        this.socket.on("offline", data => {
            var user = this.users[data.userId];
            if (!user) return;
            user.online = false;
            user.lastActivity = data.lastActivity;
            this.onlineOfflineUsersChanged = Date.now();
        });
        this.socket.on("muted", data => this.getConv(data.chatId).muted = data.muted);

        window.addEventListener("blur", () => this.blurred());
        window.addEventListener("focus", () => this.focused());
    }

    socketAuth() {
        if (this.auth.session)
            this.socket.emit("auth", { token: this.auth.session.token });
    }

    blurred() {
        this.isBlurred = true;
        // when window is blurred receive all push messages:
        this.socket.emit("dont push", {
            anything: false, chatIds: []
        });

        // when tab is not visible on mobile consider user offline
        if (this.utils.mobile) this.socket.emit("offline");
    }

    focused() {
        this.isBlurred = false;

        // when focused dont receive push messages of chats defined in dontPush(.., ..)
        this.socket.emit("dont push", {
            anything: this.dontPushAnything, chatIds: this.dontPushChatIds
        });
        this.socket.emit("online");
    }

    lostMessagesAndEvents: MessageOrEvent[] = [];

    addToConv(mess: Message, event: Event) {
        var conv = this.getConv(mess ? mess.chatId : event.chatId);

        if (event) this.processEvent(event, conv);

        if (mess) this.synchronizeUser(mess, null);
        var add: MessageOrEvent = {
            message: mess,
            event: event
        };
        var timestamp = this.timeOfMessageOrEvent(add);

        if (!conv) return this.lostMessagesAndEvents.push(add);

        if (!conv.messagesAndEvents) conv.messagesAndEvents = [add];

        else for (var i in conv.messagesAndEvents) {

            var mOrE = conv.messagesAndEvents[i];

            if (
                (mOrE.message && mess && mess.id == mOrE.message.id)
                ||
                (mOrE.event && event && event.id == mOrE.event.id)
            ) {
                Object.assign(mOrE, add);
                break;
            }

            if (this.timeOfMessageOrEvent(mOrE) > timestamp) {

                var arr = conv.messagesAndEvents.slice(0, parseInt(i));
                arr.push(add);
                conv.messagesAndEvents = arr.concat(arr, conv.messagesAndEvents.slice(parseInt(i), conv.messagesAndEvents.length));
                return;
            }
        }

        conv.messagesAndEvents.push(add);
        if (mess) conv.latestMessage = mess;
    }

    processEvent(e: Event, conv: Conversation) {

        switch (e.type) {
            case "OPPED":
                if (conv.chatAdmins) conv.chatAdmins.push(e.who);
                break;
            case "DEOPPED":
                if (conv.chatAdmins) conv.chatAdmins = conv.chatAdmins.filter(id => id != e.who);
                break;
            case "USER_REMOVED":
                if (conv.members) conv.members = conv.members.filter(m => m.id != e.who);
                this.onlineOfflineUsersChanged = Date.now();
                if (e.who == this.auth.session.user.id) conv.leftTimestamp = e.timestamp;
                break;
        }
    }

    sendMessage(chatId, text) {
        this.socket.emit("send message", { chatId, text });
    }

    setMuted(conv: Conversation, muted: boolean) {
        this.socket.emit("set muted", { chatId: conv.chatId, muted });
    }

    dontPush(anything: boolean, chatIds: number[]) {
        this.dontPushAnything = anything;
        this.dontPushChatIds = chatIds;
        this.socket.emit("dont push", { anything, chatIds });
    }

    getConv(id: number) {
        for (var conv of this.conversations) if (conv.chatId == id) return conv;
        return null;
    }

    getMessagesAndEvents(conv: Conversation, limit: number, until?: number): Observable<MessageOrEvent[]> {

        conv.loadingMore = true;

        var p = this.http.post<MessageOrEvent[]>(API_URL + "messagesAndEvents", {
            token: this.auth.session.token,
            chatId: conv.chatId, limit, until
        });
        p.subscribe(m => {

            m.forEach(mOrE => {
                if (mOrE.message) this.synchronizeUser(mOrE.message, null);
            });

            if (conv.messagesAndEvents) m = conv.messagesAndEvents.concat(m);

            m.sort((a, b) => {

                var aTime = a.event ? a.event.timestamp : a.message.sentTimestamp;
                var bTime = b.event ? b.event.timestamp : b.message.sentTimestamp;

                // very old messages dont have a timestamp, so then use ID to sort
                if (aTime == bTime && a.message && b.message) return a.message.id - b.message.id;

                return aTime - bTime;
            });
            conv.messagesAndEvents = m;
            conv.loadingMore = false;
        });

        return p;
    }

    getChatMembers(chatId: number) {
        this.http.post(API_URL + "/chatMembers", {
            token: this.auth.session.token, chatId
        }).subscribe((res: any) => {

            var conv = this.getConv(chatId);
            conv.members = res.members.map(member => {
                if (member.id in this.users) return Object.assign(this.users[member.id], member);
                var user = Object.assign(new User(), member);
                this.users[member.id] = user;
                return user;
            });
            conv.chatAdmins = res.chatAdmins;
        });
    }

    attachmentIcon(att: Attachment): string {
        if (att.type == AttachmentType.Giphy || /.png|.jpg|.jpeg|.gif/.test(att.path)) return "image";

        if (/.mp4|.ogg|.webm/.test(att.path)) return "movie";

        if (/.mp3|.wav/.test(att.path)) return "music_note";

        return "attach_file";
    }

    timeOfMessageOrEvent(mOrE: MessageOrEvent) {
        return mOrE.message ? mOrE.message.sentTimestamp : (mOrE.event ? mOrE.event.timestamp : 0);
    }

    get unreadMessages(): number {
        if (this.conversations == null) this.getConversations();
        return this._unreadMessages;
    }

    removeMember(memberId, chatId) {
        this.socket.emit("remove member", { memberId, chatId });
    }

    setAdmin(memberId, chatId, admin: boolean) {
        this.socket.emit("set admin", { memberId, chatId, admin });
    }

    private convsLoadedSub = new BehaviorSubject<boolean>(true);

    get conversationsLoaded(): Observable<boolean> {
        this.getConversations();

        return this.convsLoadedSub;
    }

    private getConversations() {

        if (!this.auth.session || this.requestingConversations) return;
        this.requestingConversations = true;

        this.http.post<Conversation[]>(API_URL + "conversations", {
            token: this.auth.session.token
        }).subscribe(c => {
            this.requestingConversations = false;
            c.forEach(conv => this.synchronizeUser(null, conv));
            c.sort((a, b) => {
                if (!a.latestMessage) return 1;
                if (!b.latestMessage) return -1;
                return a.latestMessage.sentTimestamp > b.latestMessage.sentTimestamp ? -1 : 1;
            });
            this.conversations = c.filter(conv => conv.isGroup || conv.otherUser);
            this._unreadMessages = 0;
            for (var conv of c) this._unreadMessages += conv.unread;

            this.convsLoadedSub.next(true);
            this.convsLoadedSub.complete();
        });
    }

    private synchronizeUser(message: Message, conv: Conversation) {

        if (conv && !conv.otherUser) return;

        if (message && message.sentBy == this.auth.session.user.id) {
            message.sender = this.auth.session.user;
            return;
        }

        var userId = message ? message.sentBy : conv.otherUser.id;
        var user = this.users[userId];

        if (!user) user = this.users[userId] = new User();

        if (message) {

            user.username = message.senderUsername;
            user.profilePic = message.senderProfilePic;
            user.r = message.senderFavColor.r;
            user.g = message.senderFavColor.g;
            user.b = message.senderFavColor.b;

            message.sender = user;
        }

        if (conv) conv.otherUser = Object.assign(user, conv.otherUser);
    }

}
