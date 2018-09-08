import { Injectable } from '@angular/core';
import { Conversation } from '../models/chat';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private _unreadMessages = 0;
    conversations: Conversation[];
    private requestingConversations = false;

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) { }

    get unreadMessages(): number {
        if (this.conversations == null) this.getConversations();
        return this._unreadMessages;
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
                return a.latestMessage.sentOn < b.latestMessage.sentOn ? -1 : 1;
            });
            this.conversations = c.filter(conv => conv.isGroup || conv.otherUser);
            this._unreadMessages = 0;
            for (var conv of c) this._unreadMessages += conv.unread;
            console.log(c);
        });
    }

}
