import { Component, OnInit, Host } from '@angular/core';
import { NotificationsService, VotesNotification, CommentsNotification, FriendAcceptanceNotification } from '../../services/notifications.service';
import { ModalComponent } from '../modal/modal.component';
import { Router } from '../../../../node_modules/@angular/router';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { CommentsAndVotesService } from '../../services/comments-and-votes.service';
import { PostsService } from '../../services/posts.service';

interface AllTypesNotification extends VotesNotification, CommentsNotification, FriendAcceptanceNotification {}

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

    notifications: AllTypesNotification[] = [];
    unreadSince: number;
    noNotifications: boolean;
    active = false;

    constructor(
        @Host() private modal: ModalComponent,
        public service: NotificationsService,
        public auth: AuthService,
        public commentsAndVotes: CommentsAndVotesService,
        public modals: ModalService,
        public posts: PostsService,

        private router: Router
    ) { }

    ngOnInit() {
    }

    checkActive() {
        if (!this.active && this.modal.active) {
            this.active = true;
            this.notifications = this.service.notifications as AllTypesNotification[] || [];
            this.unreadSince = this.service.checkedNotificationsTime;
            this.noNotifications = this.service.newNotifications == 0;
            this.service.read();

        } else if (!this.modal.active)
            this.active = false;

        return true;
    }

    goTo(url: string) {
        this.router.navigateByUrl(url);
        this.modals.hideModal();
    }

}
