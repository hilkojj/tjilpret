import { Component, OnInit, Input } from '@angular/core';
import { Conversation } from '../../../models/chat';
import { ChatService } from '../../../services/chat.service';
import { ModalService } from '../../../services/modal.service';

@Component({
    selector: 'app-chat-info',
    templateUrl: './chat-info.component.html',
    styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent implements OnInit {

    @Input() conv: Conversation;

    constructor(
        public service: ChatService,
        public modals: ModalService
    ) { }

    ngOnInit() {
    }

}
