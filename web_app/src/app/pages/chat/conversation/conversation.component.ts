import { Component, OnInit, Input } from '@angular/core';
import { Conversation } from '../../../models/chat';
import { ChatService } from '../../../services/chat.service';

@Component({
    selector: 'app-conversation',
    templateUrl: './conversation.component.html',
    styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent {

    private _conv: Conversation;

    get conv(): Conversation {
        return this._conv;
    }

    @Input()
    set conv(conv: Conversation) {
        this._conv = conv;
        if (!this.conv.messagesAndEvents) this.service.getMessagesAndEvents(this.conv.chatId, 32);
        else if (this.conv.messagesAndEvents.length < 32) {

            var latest = this.conv.messagesAndEvents[0];

            this.service.getMessagesAndEvents(
                this.conv.chatId, 32,
                latest ? (latest.message ? latest.message.sentTimestamp : latest.event.timestamp) : null
            );
        }
    }

    constructor(
        public service: ChatService
    ) { }

}
