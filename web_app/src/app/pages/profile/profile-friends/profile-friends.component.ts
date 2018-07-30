import { Component, OnInit, Host } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-profile-friends',
    templateUrl: './profile-friends.component.html',
    styleUrls: ['./profile-friends.component.scss']
})
export class ProfileFriendsComponent implements OnInit {

    constructor(
        @Host() public profile: ProfileComponent,
        public auth: AuthService,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle("Vriends van " + this.profile.user.username);
    }

}
