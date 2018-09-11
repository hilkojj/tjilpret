import { Injectable } from '@angular/core';
import { Conversation, Attachment, AttachmentType, MessageOrEvent } from '../models/chat';
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

    private _unreadMessages = 0;
    private requestingConversations = false;

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        this.socket = io(SITE_URL);
        auth.onAuthenticatedListeners.push(() => {
            this.socket.emit("auth", { token: auth.session.token });

            http.post(API_URL + "chatWallpaperUrl", {
                token: auth.session.token
            }).subscribe((res: any) => {
                if (res.url) this.wallpaperUrl = res.url;
            });
        });
    }

    getMessagesAndEvents(chatId: number, limit: number, until?: number): Observable<MessageOrEvent[]> {
        var p = this.http.post<MessageOrEvent[]>(API_URL + "messagesAndEvents", {
            token: this.auth.session.token,
            chatId, limit, until
        });

        p.subscribe(m => {

            var conv = this.conversations.filter(conv => conv.chatId == chatId)[0];
            if (conv) {

                if (conv.messagesAndEvents) m = conv.messagesAndEvents.concat(m);
                
                m.sort((a, b) => {

                    var aTime = a.event ? a.event.timestamp : a.message.sentTimestamp;
                    var bTime = b.event ? b.event.timestamp : b.message.sentTimestamp;

                    // very old messages dont have a timestamp, so then use ID to sort
                    if (aTime == bTime && a.message && b.message) return a.message.id - b.message.id;

                    return aTime - bTime;
                });

                conv.messagesAndEvents = m;
            }
        });

        return p;
    }

    attachmentIcon(att: Attachment): string {
        if (att.type == AttachmentType.Giphy || /.png|.jpg|.jpeg|.gif/.test(att.path)) return "image";

        if (/.mp4|.ogg|.webm/.test(att.path)) return "movie";

        if (/.mp3|.wav/.test(att.path)) return "music_note";

        return "attach_file";
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
                return a.latestMessage.sentTimestamp < b.latestMessage.sentTimestamp ? -1 : 1;
            });
            this.conversations = c.filter(conv => conv.isGroup || conv.otherUser);
            this._unreadMessages = 0;
            for (var conv of c) this._unreadMessages += conv.unread;

            this.convsLoadedSub.next(true);
            this.convsLoadedSub.complete();
        });
    }

}
