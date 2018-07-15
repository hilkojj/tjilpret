import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { FriendsService, FriendStatus } from '../../services/friends.service';

@Component({
    selector: 'app-friend-button',
    templateUrl: './friend-button.component.html',
    styleUrls: ['./friend-button.component.scss']
})
export class FriendButtonComponent implements OnInit {

    @Input() user: User;

    enum = FriendStatus;

    constructor(
        public friends: FriendsService
    ) { }

    ngOnInit() {
        this.friends.startInterval();
    }

    confirm() {
        this.friends.confirm(this.user.id, confirm(`Wilt u ${this.user.username} aanvaarden als vriend?`));
    }

    remove() {
        if (confirm(`${this.user.username} verwijdren als vrient?`))
            this.friends.remove(this.user.id);
    }

}
