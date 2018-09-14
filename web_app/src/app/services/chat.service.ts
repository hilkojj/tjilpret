import { Injectable } from '@angular/core';
import { Conversation, Attachment, AttachmentType, MessageOrEvent, Message } from '../models/chat';
import { HttpClient } from '@angular/common/http';
import { API_URL, SITE_URL } from '../constants';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    wallpaperUrl: string;
    conversations: Conversation[];
    socket;

    users: { [userId: number]: User } = {};

    private _unreadMessages = 0;
    private requestingConversations = false;

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.socket = (window as any).socket = io(SITE_URL || "http://localhost:8080");
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
            this.addMessageToConv(message);
        });
        this.socket.on("logged out", () => {
            if (auth.loggingOut) return; // logout was expected.

            //logout was unexpected, notify user and reload webapp:
            alert("Je bent uitgelogd.");
            window.location.href = "/";
        })
    }

    socketAuth() {
        if (this.auth.session)
            this.socket.emit("auth", { token: this.auth.session.token });
    }

    lostMessagesAndEvents: MessageOrEvent[] = [];

    addMessageToConv(mess: Message) {
        var conv = this.getConv(mess.chatId);

        this.synchronizeUser(mess);
        var add: MessageOrEvent = {
            message: mess
        };
        var timestamp = this.timeOfMessageOrEvent(add);

        if (!conv) return this.lostMessagesAndEvents.push(add);

        if (!conv.messagesAndEvents) conv.messagesAndEvents = [add];

        else for (var i in conv.messagesAndEvents) {

            if (this.timeOfMessageOrEvent(conv.messagesAndEvents[i]) > timestamp) {

                var arr = conv.messagesAndEvents.slice(0, parseInt(i));
                arr.push(add);
                conv.messagesAndEvents = arr.concat(arr, conv.messagesAndEvents.slice(parseInt(i), conv.messagesAndEvents.length));
                return;
            }
        }

        conv.messagesAndEvents.push(add);
    }

    sendMessage(chatId, text) {
        this.socket.emit("send message", {
            chatId, text
        });
    }

    dontPush(anything: boolean, chatIds: number[]) {
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
                if (mOrE.message) this.synchronizeUser(mOrE.message);
            });

            if (conv.messagesAndEvents) m = conv.messagesAndEvents.concat(m);

            m.sort((a, b) => {

                var aTime = a.event ? a.event.timestamp : a.message.sentTimestamp;
                var bTime = b.event ? b.event.timestamp : b.message.sentTimestamp;

                // very old messages dont have a timestamp, so then use ID to sort
                if (aTime == bTime && a.message && b.message) return a.message.id - b.message.id;

                return aTime - bTime;
            });

            console.log(conv);
            conv.messagesAndEvents = m;
            conv.loadingMore = false;
        });

        return p;
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
            c.map(conv => {
                conv.otherUser = conv.otherUser == null ? null : Object.assign(new User(), conv.otherUser);
            });
            c.sort((a, b) => {
                if (!a.latestMessage) return -1;
                if (!b.latestMessage) return 1;
                return a.latestMessage.sentTimestamp > b.latestMessage.sentTimestamp ? -1 : 1;
            });
            this.conversations = c.filter(conv => conv.isGroup || conv.otherUser);
            this._unreadMessages = 0;
            for (var conv of c) this._unreadMessages += conv.unread;

            this.convsLoadedSub.next(true);
            this.convsLoadedSub.complete();
        });
    }

    private synchronizeUser(message: Message) {

        if (message.sentBy == this.auth.session.user.id) {
            message.sender = this.auth.session.user;
            return;
        }

        var user = this.users[message.sentBy];

        if (!user) user = this.users[message.sentBy] = new User();

        user.username = message.senderUsername;
        user.profilePic = message.senderProfilePic;
        user.r = message.senderFavColor.r;
        user.g = message.senderFavColor.g;
        user.b = message.senderFavColor.b;

        message.sender = user;
    }

}
