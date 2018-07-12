import { Component, OnInit, Host } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '../../../../../node_modules/@angular/platform-browser';

@Component({
    selector: 'app-profile-groups',
    templateUrl: './profile-groups.component.html',
    styleUrls: ['./profile-groups.component.scss']
})
export class ProfileGroupsComponent implements OnInit {

    constructor(
        @Host() private profile: ProfileComponent,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle("Groeps van " + this.profile.user.username);
    }

}
