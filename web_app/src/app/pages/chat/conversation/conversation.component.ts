import { Component, OnInit, Input } from '@angular/core';
import { Conversation } from '../../../models/chat';
import { ThemeService } from '../../../services/theme.service';

@Component({
    selector: 'app-conversation',
    templateUrl: './conversation.component.html',
    styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {

    @Input() conv: Conversation;

    constructor() { }

    ngOnInit() {
    }

}
