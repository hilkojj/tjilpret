import { Component, OnInit, Host } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '../../../../../node_modules/@angular/platform-browser';

@Component({
    selector: 'app-profile-uploads',
    templateUrl: './profile-uploads.component.html',
    styleUrls: ['./profile-uploads.component.scss']
})
export class ProfileUploadsComponent implements OnInit {

    constructor(
        @Host() private profile: ProfileComponent,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle("Uploods van " + this.profile.user.username);
    }

}
