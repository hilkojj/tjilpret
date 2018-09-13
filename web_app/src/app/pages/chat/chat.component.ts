import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Conversation } from '../../models/chat';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { ServiceWorkerService } from '../../services/service-worker.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    convSearchQuery = "";
    currentConv: Conversation;

    constructor(
        public auth: AuthService,
        public service: ChatService,
        public serviceWorker: ServiceWorkerService,

        private route: ActivatedRoute,
        private themes: ThemeService
    ) { }

    ngOnInit() {

        this.route.params.subscribe(params => {

            var chatId = params.chatId | 0;
            this.currentConv = null;
            
            for (var c of this.service.conversations) if (c.chatId == chatId) this.currentConv = c;

            if (this.currentConv && !this.currentConv.isGroup) this.themes.applyFavColor(this.currentConv.otherUser);
            else this.themes.applyFavColor(this.auth.session.user);
        });

    }

    convTitle(conv: Conversation): string {
        return conv.isGroup ? conv.groupTitle : conv.otherUser.username;
    }
    
}
