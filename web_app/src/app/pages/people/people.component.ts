import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FriendsService, Invite } from '../../services/friends.service';
import { Filter } from '../../components/search/search.component';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit, AfterContentChecked {

    invites: Invite[];
    filters: Filter[] = [
        {
            name: "colorClass",
            text: "Lieflingskleur",
            options: [
                {
                    value: "all",
                    text: "De hele regenboog"
                }
            ]
        },
        {
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
        },
        {
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
        }
    ];

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
