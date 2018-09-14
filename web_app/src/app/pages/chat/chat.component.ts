import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Conversation } from '../../models/chat';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { ServiceWorkerService } from '../../services/service-worker.service';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

    convSearchQuery = "";
    currentConv: Conversation;

    constructor(
        public auth: AuthService,
        public service: ChatService,
        public serviceWorker: ServiceWorkerService,

        private route: ActivatedRoute,
        private themes: ThemeService,
        private utils: UtilsService
    ) { }

    ngOnInit() {

        this.route.params.subscribe(params => {

            var chatId = params.chatId | 0;
            this.currentConv = null;

            for (var c of this.service.conversations) if (c.chatId == chatId) this.currentConv = c;

            if (this.currentConv && !this.currentConv.isGroup) this.themes.applyFavColor(this.currentConv.otherUser);
            else this.themes.applyFavColor(this.auth.session.user);

            // dont receive push notifications for current conversation
            if (this.utils.mobile && this.currentConv) 
                this.service.dontPush(false, [this.currentConv.chatId])

            // if on desktop or in conversations overview dont receive push notifications at all.
            else this.service.dontPush(true, []);
        });

    }

    ngOnDestroy() {
        // re-enable all push notifications
        this.service.dontPush(false, []);
    }

    convTitle(conv: Conversation): string {
        return conv.isGroup ? conv.groupTitle : conv.otherUser.username;
    }

}
