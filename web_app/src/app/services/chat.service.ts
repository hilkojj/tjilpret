import { Injectable } from '@angular/core';
import { Conversation } from '../models/chat';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { AuthService } from './auth.service';

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
            this.conversations = c;
            this._unreadMessages = 0;
            for (var conv of c) this._unreadMessages += conv.unread;
        });
    }

}
