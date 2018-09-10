import { Injectable } from '@angular/core';
import { Conversation, Attachment, AttachmentType } from '../models/chat';
import { HttpClient } from '@angular/common/http';
import { API_URL, SITE_URL } from '../constants';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

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
        });
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

    private convsObs: Observable<Conversation[]>;

    get conversationsLoaded(): Observable<boolean> {
        this.getConversations();
        return this.convsObs.map(_ => true);
    }

    private getConversations() {
        if (!this.auth.session || this.requestingConversations) return;
        this.requestingConversations = true;
        this.convsObs = this.http.post<Conversation[]>(API_URL + "conversations", {
            token: this.auth.session.token
        });
        
        this.convsObs.subscribe(c => {
            this.requestingConversations = false;
            c.map(conv => {
                conv.otherUser = conv.otherUser == null ? null : Object.assign(new User(), conv.otherUser);
            });
            c.sort((a, b) => {
                if (!a.latestMessage) return -1;
                if (!b.latestMessage) return 1;
                return a.latestMessage.sentOn < b.latestMessage.sentOn ? -1 : 1;
            });
            this.conversations = c.filter(conv => conv.isGroup || conv.otherUser);
            this._unreadMessages = 0;
            for (var conv of c) this._unreadMessages += conv.unread;
        });
    }

}
