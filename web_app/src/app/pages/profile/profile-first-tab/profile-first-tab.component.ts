import { Component, OnInit, Host } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { ColorClass } from '../../../models/colors';
import { ActivatedRoute } from '@angular/router';

interface Stat {
    icon: string,
    title: string,
    number: number,
    color: string
}

@Component({
    selector: 'app-profile-first-tab',
    templateUrl: './profile-first-tab.component.html',
    styleUrls: ['./profile-first-tab.component.scss']
})
export class ProfileFirstTabComponent implements OnInit {

    constructor(
        @Host() public profile: ProfileComponent,
        private title: Title,
        private route: ActivatedRoute
    ) { }

    colorClass: ColorClass;
    stats: Stat[];

    ngOnInit() {
        this.colorClass = this.route.snapshot.data.colorClass;
        this.title.setTitle(this.profile.user.username);
        this.stats = [
            {
                icon: "thumbs_up_down",
                title: "Reputatie",
                number: this.profile.user.rep,
                color: this.profile.user.rep < 0 ? "red accent-3" : "green accent-3"
            },
            {
                icon: "forum",
                title: "Tjet berichte",
                number: this.profile.user.messages,
                color: "indigo accent-3"
            },
            {
                icon: "create",
                title: "Groeps opgericht",
                number: this.profile.user.groupsStarted,
                color: "deep-orange"
            },
            {
                icon: "visibility",
                title: "Views",
                number: this.profile.user.views,
                color: "indigo"
            },
            {
                icon: "chat_bubble",
                title: "Reakties agtergelaten",
                number: this.profile.user.comments,
                color: "purple accent-4"
            },
            {
                icon: "subscriptions",
                title: "Uploods",
                number: this.profile.user.uploads,
                color: "orange accent-4"
            },
        ];
    }

}
