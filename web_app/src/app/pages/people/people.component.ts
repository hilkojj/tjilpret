import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FriendsService, Invite } from '../../services/friends.service';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit, AfterContentChecked {

    invites: Invite[];

    constructor(
        public friends: FriendsService
    ) { }

    ngOnInit() {
        this.invites = this.friends.receivedInvites;
    }

    ngAfterContentChecked() {
        if (this.friends.receivedInvites.length != this.invites.length) {
            this.invites = this.friends.receivedInvites;
            return;
        }
        var i = 0;
        for (var invite of this.friends.receivedInvites) {
            var thisInvite = this.invites[i++];
            if (!thisInvite || invite.userInfo != thisInvite.userInfo) {
                this.invites = this.friends.receivedInvites;
                break;
            }
        }
    }

}
