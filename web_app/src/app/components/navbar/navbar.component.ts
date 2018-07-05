import { Component, OnInit, HostListener } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Tab } from '../tabs/tabs.component';
import { tWords, pWords } from './random-words';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    constructor(
        private utils: UtilsService,
        private auth: AuthService,
        private modals: ModalService
    ) { }

    randomWords = "";
    randomWordsTimeout;

    tabs: Tab[] = [
        new Tab("Hoom", "home", "/hoom"),
        new Tab("Amusement", "subscriptions", "/amusement"),
        new Tab("Tjets", "chat_bubble", "/tjets"),
        new Tab("Mesnen & vriends", "group", "/vriends")
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

}
