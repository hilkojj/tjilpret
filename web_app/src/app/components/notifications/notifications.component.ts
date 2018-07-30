import { Component, OnInit, Host } from '@angular/core';
import { NotificationsService, VotesNotification, CommentsNotification, FriendAcceptanceNotification } from '../../services/notifications.service';
import { ModalComponent } from '../modal/modal.component';
import { Router } from '../../../../node_modules/@angular/router';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';

interface AllTypesNotification extends VotesNotification, CommentsNotification, FriendAcceptanceNotification {}

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

    notifications: AllTypesNotification[] = [];
    unreadSince: number;
    active = false;

    constructor(
        @Host() private modal: ModalComponent,
        public service: NotificationsService,
        public auth: AuthService,

        private router: Router,
        private modals: ModalService
    ) { }

    ngOnInit() {
    }

    checkActive() {
        if (!this.active && this.modal.active) {
            this.active = true;
            this.notifications = this.service.notifications as AllTypesNotification[] || [];
            this.unreadSince = this.service.checkedNotificationsTime;
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
