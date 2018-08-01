import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FriendsService, Invite } from '../../services/friends.service';
import { Filter, Search } from '../../components/search/search.component';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { EditProfileService } from '../../services/edit-profile.service';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit, AfterContentChecked {

    invites: Invite[];

    foundUsers: User[] = [];
    canLoadMore = true;
    noResultsText = "";
    
    colorFilter: Filter = {
        name: "colorClass",
        text: "Lieflingskleur",
        options: [
            {
                value: "all",
                text: "De hele regenboog"
            }
        ]
    };
    sortByFilter: Filter = {
        name: "sortBy",
        text: "Sorteer op",
        options: [
            {
                value: "joined",
                text: "Nieuwste account"
            },
            {
                value: "activity",
                text: "Laatst actief"
            },
            {
                value: "friends",
                text: "Aantal vriends"
            },
            {
                value: "rep",
                text: "Reputatie"
            },
            {
                value: "messages",
                text: "Aantal tjetberichten"
            },
            {
                value: "uploads",
                text: "Aantal uploods"
            }
        ]
    };
    descFilter: Filter = {
        name: "desc",
        text: "Volgorde",
        options: [
            {
                value: 1,
                text: "Aflopend"
            },
            {
                value: 0,
                text: "Oplopend"
            }
        ]
    };
    filters: Filter[] = [this.sortByFilter, this.descFilter, this.colorFilter];

    constructor(
        public friends: FriendsService,
        public users: UserService,
        public editProfile: EditProfileService
    ) { }

    ngOnInit() {

        this.editProfile.getColorClasses().subscribe(classes => {
            for (var c of classes) {
                this.colorFilter.options.push(
                    {
                        value: c.id,
                        text: c.name + ` (${c.people})`
                    }
                );
            }
        });

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

    onSearch(search: Search) {
        this.users.searchUsers(
            search.query, search.page,
            this.colorFilter.selectedOption.value as number | string,
            this.sortByFilter.selectedOption.value as string,
            this.descFilter.selectedOption.value as boolean
        ).subscribe(users => {
            
            if (search.page != 0) this.foundUsers = this.foundUsers.concat(users);
            else this.foundUsers = users;

            this.canLoadMore = users.length > 0;
            this.noResultsText = this.foundUsers.length == 0 ? "Geen tjillers voldoen aan deze criteria." : "";
        });
    }

}
