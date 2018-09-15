import { Component, OnInit, OnDestroy, HostBinding, AfterViewChecked } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Conversation } from '../../models/chat';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { ServiceWorkerService } from '../../services/service-worker.service';
import { UtilsService } from '../../services/utils.service';
import { DomSanitizer, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

    convSearchQuery = "";
    currentConv: Conversation;

    @HostBinding('class.only-conversations')
    get onlyConversations(): boolean {
        return this.currentConv == null;
    }


    show = true;

    constructor(
        public auth: AuthService,
        public service: ChatService,
        public serviceWorker: ServiceWorkerService,

        private route: ActivatedRoute,
        private themes: ThemeService,
        private utils: UtilsService,
        private san: DomSanitizer,
        private title: Title
    ) { }

    ngOnInit() {

        this.route.params.subscribe(params => {

            if (params.chatId == "geheim") this.show = true;

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

    ngAfterViewChecked() {
        this.title.setTitle(
            (this.service.unreadMessages ? `(${this.service.unreadMessages}) ` : '') + "Tjets"
        )
    }

    convTitle(conv: Conversation): string {
        return conv.isGroup ? conv.groupTitle : conv.otherUser.username;
    }

    boxShadow(conv: Conversation) {
        var user = conv.otherUser ? conv.otherUser : this.auth.session.user;
        var rgba = `rgba(${user.r}, ${user.g}, ${user.b}, .2)`;
        return this.san.bypassSecurityTrustStyle(`0 5px 10px ${rgba}`);
    }

}
