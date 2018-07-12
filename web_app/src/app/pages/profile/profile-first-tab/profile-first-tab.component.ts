import { Component, OnInit, Host } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '../../../../../node_modules/@angular/platform-browser';

@Component({
    selector: 'app-profile-first-tab',
    templateUrl: './profile-first-tab.component.html',
    styleUrls: ['./profile-first-tab.component.scss']
})
export class ProfileFirstTabComponent implements OnInit {

    constructor(
        @Host() private profile: ProfileComponent,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle(this.profile.user.username);
    }

}
