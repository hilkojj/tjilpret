import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Tab } from '../tabs/tabs.component';
import { tWords, pWords } from './random-words';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    constructor(
        private utils: UtilsService
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

}
