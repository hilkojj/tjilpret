import { Component, OnInit, Host, OnDestroy } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { EmoticonsService } from '../../../services/emoticons.service';
import { Emoticon } from 'src/app/models/emoticons';

@Component({
    selector: 'app-profile-emoticons',
    templateUrl: './profile-emoticons.component.html',
    styleUrls: ['./profile-emoticons.component.scss']
})
export class ProfileEmoticonsComponent implements OnInit, OnDestroy {

    emoticons: Emoticon[];
    interval;

    constructor(
        public service: EmoticonsService,
        @Host() public profile: ProfileComponent,

        private title: Title
    ) { }

    ngOnInit() {
        this.update();
        this.interval = setInterval(() => this.update(), 4000);
        this.title.setTitle("Emotikons van " + this.profile.user.username);
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    update() {
        this.service.emoticonsOfUser(this.profile.user.id).subscribe(
            e => this.emoticons = !this.emoticons || e.length != this.emoticons.length ? e : this.emoticons
        );
    }

    delete(name: string) {
        if (confirm(`Wil je egt :${name}: verwydren?`))
            this.service.deleteEmoticon(name).subscribe(success => success && this.update());
    }

}
