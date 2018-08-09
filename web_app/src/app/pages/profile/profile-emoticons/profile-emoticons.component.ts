import { Component, OnInit, Host } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { EmoticonsService } from '../../../services/emoticons.service';

@Component({
    selector: 'app-profile-emoticons',
    templateUrl: './profile-emoticons.component.html',
    styleUrls: ['./profile-emoticons.component.scss']
})
export class ProfileEmoticonsComponent implements OnInit {

    constructor(
        public emoticons: EmoticonsService,

        @Host() private profile: ProfileComponent,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle("Emotikons van " + this.profile.user.username);
    }

}
