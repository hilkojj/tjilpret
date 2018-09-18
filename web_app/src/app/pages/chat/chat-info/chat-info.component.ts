import { Component, OnInit, Input } from '@angular/core';
import { Conversation } from '../../../models/chat';
import { ChatService } from '../../../services/chat.service';
import { ModalService } from '../../../services/modal.service';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-chat-info',
    templateUrl: './chat-info.component.html',
    styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent implements OnInit {

    private updated = 0;
    private _online: User[];

    get online(): User[] {
        if (!this.conv.members) return [];

        if (this.service.onlineOfflineUsersChanged > this.updated || !this._online) {
            this.setOnlineOfflineArrays();
            this.updated = Date.now();
        }
        return this._online;
    }

    private _offline: User[];

    get offline(): User[] {
        if (!this.conv.members) return [];

        if (this.service.onlineOfflineUsersChanged > this.updated || !this._online) {
            this.setOnlineOfflineArrays();
            this.updated = Date.now();
        }
        return this._offline;
    }

    private setOnlineOfflineArrays() {
        this.conv.members.sort((a, b) => b.lastActivity - a.lastActivity);
        this._online = this.conv.members.filter(m => m.online);
        this._offline = this.conv.members.filter(m => !m.online);
    }

    get chatAdmin(): boolean {
        return this.conv.chatAdmins && this.conv.chatAdmins.includes(this.auth.session.user.id);
    }

    isChatAdmin(userId: number) {
        return this.conv.chatAdmins && this.conv.chatAdmins.includes(userId);
    }

    editMember: User;

    private _conv: Conversation;

    @Input()
    set conv(conv: Conversation) {
        this._conv = conv;
        this.showAllMembers = false;
        this.editMember = null;
        this._online = null;
        this._offline = null;
    }

    get conv(): Conversation {
        return this._conv;
    }

    showAllMembers = false;

    constructor(
        public service: ChatService,
        public modals: ModalService,
        public auth: AuthService
    ) { }

    ngOnInit() {
    }

    removeMember(userId: number) {
        if (confirm("Is dit een doordachte keuze?")) this.service.removeMember(userId, this.conv.chatId);
        this.editMember = null;
    }

}
