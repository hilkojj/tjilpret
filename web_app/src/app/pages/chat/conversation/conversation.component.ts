import { Component, OnInit, Input } from '@angular/core';
import { Conversation, Message } from '../../../models/chat';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';

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

        if (conv.loadingMore) return; // prevent loading twice

        if (!this.conv.messagesAndEvents) this.service.getMessagesAndEvents(this.conv, 32);
        else if (this.conv.messagesAndEvents.length < 32) {

            var latest = this.conv.messagesAndEvents[0];

            this.service.getMessagesAndEvents(
                this.conv, 32,
                latest ? (latest.message ? latest.message.sentTimestamp : latest.event.timestamp) -1 : null
            );
        }
    }

    constructor(
        public service: ChatService,
        public auth: AuthService
    ) { }

    firstOfUser(message: Message, index: number) {
        var prev = this.conv.messagesAndEvents[index - 1];
        if (!prev || prev.event) return true;
        return prev.message.sentBy != message.sentBy;
    }

    lastOfUser(message: Message, index: number) {
        var next = this.conv.messagesAndEvents[index + 1];
        if (!next || next.event) return true;
        return next.message.sentBy != message.sentBy;
    }

}
