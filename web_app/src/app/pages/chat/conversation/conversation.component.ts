import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { Conversation, Message } from '../../../models/chat';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { ServiceWorkerService } from '../../../services/service-worker.service';

@Component({
    selector: 'app-conversation',
    templateUrl: './conversation.component.html',
    styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy, AfterViewChecked {

    @ViewChild('input') input: ElementRef;
    inputText = "";

    @ViewChild('scrollDiv') scrollDiv: ElementRef;

    private _conv: Conversation;

    get conv(): Conversation {
        return this._conv;
    }

    send() {
        this.service.sendMessage(this.conv.chatId, this.inputText);
        this.inputText = "";
    }

    @Input()
    set conv(conv: Conversation) {
        this._conv = conv;

        if (conv.loadingMore) return; // prevent loading twice

        if (!conv.messagesAndEvents) this.service.getMessagesAndEvents(conv, 32);
        else if (conv.messagesAndEvents.length < 32) {
            var latest = conv.messagesAndEvents[0];

            this.service.getMessagesAndEvents(
                conv, 32,
                latest ? (latest.message ? latest.message.sentTimestamp : latest.event.timestamp) - 1 : null
            );
        }

        if (conv.messagesAndEvents) for (var mOrE of conv.messagesAndEvents)
            if (mOrE.message) mOrE.message.justNew = false;
    }

    constructor(
        public service: ChatService,
        public auth: AuthService,
        public swService: ServiceWorkerService
    ) { }

    focusListener = async () => {

        var notifications: any = await this.swService.registration.getNotifications();
        notifications
            .filter(n => n.data && n.data.message && n.data.message.chatId == this.conv.chatId)
            .forEach(n => n.close());
    }

    ngOnInit() {
        window.addEventListener("focus", this.focusListener);
    }

    ngOnDestroy() {
        window.removeEventListener("focus", this.focusListener);
    }

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

    ngAfterViewChecked() {
        this.textareaHeight(this.input.nativeElement);
        this.updateScroll(this.scrollDiv.nativeElement);
    }

    textareaHeight(el: HTMLElement) {

        // compute the height difference which is caused by border and outline
        var outerHeight = parseInt(window.getComputedStyle(el).height, 10);
        var diff = outerHeight - el.clientHeight;

        // set the height to 0 in case of it has to be shrinked
        el.style.height = 0 + "px";

        // set the correct height
        // el.scrollHeight is the full height of the content, not just the visible part
        el.style.height = Math.min(el.scrollHeight + diff, 160) + 'px';
    }

    updateScroll(el: HTMLElement) {
        el.scrollTop = el.scrollHeight;
    }

}
