import { Component, OnInit, HostListener } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Tab } from '../tabs/tabs.component';
import { tWords, pWords } from './random-words';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';
import { NotificationsService } from '../../services/notifications.service';
import { FriendsService } from '../../services/friends.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    constructor(
        public utils: UtilsService,
        public auth: AuthService,
        public modals: ModalService,
        public notifications: NotificationsService,

        private friends: FriendsService,
        private router: Router
    ) { }

    randomWords = "";
    randomWordsTimeout;

    tabs: Tab[] = [
        new Tab("Hoom", "home", "/hoom", true),
        new Tab("Amusement", "subscriptions", "/dollepret", false),
        new Tab("Tjets", "chat_bubble", "/tjets/overzicht", true),
        new Tab("Mesnen & vriends", "group", "/tjillers", true, null, () => this.friends.receivedInvites.length)
    ];

    ngOnInit() {
    }

    showRandomWords() {
        this.randomWords = "♥ " +  tWords[Math.floor(Math.random() * tWords.length)] + " " + pWords[Math.floor(Math.random() * pWords.length)];
        clearTimeout(this.randomWordsTimeout);
        this.randomWordsTimeout = setTimeout(() => {
            this.randomWords = "";
        }, 2000);
    }

    collapseNavbar = false;
    prevScrollTop = 0;
    showAt = 0;
    collapseAt = 0;

    @HostListener('window:scroll', ['$event'])
    updateNavbar() {
        var scrollTop = document.getElementsByTagName("html")[0].scrollTop;

        if (scrollTop < 64) {
            this.collapseNavbar = false
            return;
        }

        var delta = scrollTop - this.prevScrollTop;
        if (delta > 0 && scrollTop >= this.collapseAt) {
            this.collapseNavbar = true;
            this.showAt = scrollTop - 20;
        }

        if (delta < 0 && scrollTop <= this.showAt) {
            this.collapseNavbar = false;
            this.collapseAt = scrollTop + 20;
        }
        
        this.prevScrollTop = scrollTop;
    }

    get noTabSelected(): boolean {

        var url = this.router.url.split(";")[0].split("#")[0].split("?")[0];

        for (var i in this.tabs) {
            var tab = this.tabs[i];
            if (url.startsWith(tab.routerLink + "")) return false;
        }

        return true;
    }

}
