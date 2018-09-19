import { Component, Input, AfterViewChecked, Host, ViewChild } from '@angular/core';
import { Conversation } from '../../../models/chat';
import { ChatService } from '../../../services/chat.service';
import { FriendsService } from '../../../services/friends.service';
import { AuthService } from '../../../services/auth.service';
import { User } from 'src/app/models/user';
import { ModalService } from '../../../services/modal.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
    selector: 'app-add-friend-modal',
    templateUrl: './add-friend-modal.component.html',
    styleUrls: ['./add-friend-modal.component.scss']
})
export class AddFriendModalComponent implements AfterViewChecked {

    private _conv: Conversation;
    private loadingMore = false;

    canLoadMore = true;
    page = 0;
    friends: User[];
    selectedFriends: User[] = [];
    active = false;
    @ViewChild(ModalComponent) modal: ModalComponent;

    @Input() set conv(conv: Conversation) {
        if (conv == this._conv) return;
        this._conv = conv;

        this.reset();
    }

    get conv(): Conversation {
        return this._conv;
    }

    ngAfterViewChecked() {
        if (!this.modal.active && this.active) setTimeout(() => this.reset(), 10);
        this.active = this.modal.active;
    }
    
    reset() {
        console.log("reset");
        this.page = 0;
        this.friends = null;
        this.canLoadMore = true;
        this.selectedFriends = [];
    }

    constructor(
        public service: ChatService,
        public friendsService: FriendsService,
        public auth: AuthService,
        public modals: ModalService
    ) { }

    loadMore() {

        if (!this.conv.members || this.loadingMore || !this.active) return;

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

    addAndClose() {

        this.selectedFriends.forEach(f => this.service.addFriendToGroup(this.conv.chatId, f.id));

        this.modals.hideModal();
    }

}
