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

    get online(): User[] {
        if (!this.conv.members) return [];
        return this.conv.members.filter(m => m.online).sort((a, b) => b.lastActivity - a.lastActivity);
    }

    get offline(): User[] {
        if (!this.conv.members) return [];
        return this.conv.members.filter(m => !m.online).sort((a, b) => b.lastActivity - a.lastActivity);
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
        if (alert("Is dit een doordachte keuze?")) this.service.removeMember(userId, this.conv.chatId);
    }

}
