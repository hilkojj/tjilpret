import { Component, OnInit, Host } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';
import { User } from 'src/app/models/user';
import { Search } from '../../../components/search/search.component';
import { FriendsService } from '../../../services/friends.service';

@Component({
    selector: 'app-profile-friends',
    templateUrl: './profile-friends.component.html',
    styleUrls: ['./profile-friends.component.scss']
})
export class ProfileFriendsComponent implements OnInit {

    foundFriends: User[];
    canLoadMore = true;
    noResultsText = "";

    constructor(
        @Host() public profile: ProfileComponent,
        public auth: AuthService,

        private friends: FriendsService,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle("Vriends van " + this.profile.user.username);
    }

    onSearch(search: Search) {
        if (search.page == 0) this.canLoadMore = true;

        this.friends.getFriendsOf(this.profile.user.id, search.query, search.page).subscribe(users => {
            this.foundFriends = search.page == 0 ? users : this.foundFriends.concat(users);

            this.canLoadMore = users.length > 2;

            if (this.foundFriends.length == 0 && search.query != "")
                this.noResultsText = `Geen vrienden gevonden voor '${search.query}'`;
            else this.noResultsText = "";
        });
    }

}
