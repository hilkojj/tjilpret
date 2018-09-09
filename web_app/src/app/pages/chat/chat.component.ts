import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Conversation } from '../../models/chat';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    convSearchQuery = "";

    constructor(
        public auth: AuthService,
        public service: ChatService
    ) { }

    ngOnInit() {
    }

    convTitle(conv: Conversation): string {
        return conv.isGroup ? conv.groupTitle : conv.otherUser.username;
    }
    
}
