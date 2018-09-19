import { Component, Input, AfterViewChecked } from '@angular/core';
import { Conversation } from '../../../models/chat';
import { ChatService } from '../../../services/chat.service';
import { FriendsService } from '../../../services/friends.service';
import { AuthService } from '../../../services/auth.service';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-add-friend-modal',
    templateUrl: './add-friend-modal.component.html',
    styleUrls: ['./add-friend-modal.component.scss']
})
export class AddFriendModalComponent {

    private _conv: Conversation;
    private loadingMore = false;

    canLoadMore = true;
    page = 0;
    friends: User[];

    @Input() set conv(conv: Conversation) {
        if (conv == this._conv) return;
        this._conv = conv;
        this.page = 0;
        this.friends = null;
        this.canLoadMore = true;

        this.loadMore();
    }

    get conv(): Conversation {
        return this._conv;
    }

    constructor(
        public service: ChatService,
        public friendsService: FriendsService,
        public auth: AuthService
    ) { }

    loadMore() {

        if (!this.conv.members || this.loadingMore) return;

        this.loadingMore = true;

        this.friendsService.getFriendsOf(this.auth.session.user.id, "", this.page++).subscribe(friends => {
            
            this.canLoadMore = friends.length > 1;

            this.loadingMore = false;

            friends = friends.filter(u => {
                for (var member of this.conv.members) if (member.id == u.id) return false;
                return true;
            });

            this.friends = !this.friends ? friends : this.friends.concat(friends);
        })
    }

}
