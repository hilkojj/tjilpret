import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { User } from '../models/user';
import { Comment } from '../models/comment';
import { Post } from '../models/post';

export enum NotificationType {
    Comments = "COMMENTS",
    Votes = "VOTES",
    FriendAcceptance = "FRIEND_ACCEPTANCE"
}

export interface Notification {

    type: NotificationType;
    time: number;
    userIds: number[];

}

export interface VotesNotification extends Notification {
    comment: Comment;
    post: Post;
    numberOfVotes: number;
    up: boolean;
}

export interface CommentsNotification extends Notification {
    commentsOnMyProfile: boolean;
    commentsOnMyPost: Post;
    commentsOnMyComment: Comment;
    numberOfCommenters: number;
}

export interface FriendAcceptanceNotification extends Notification {
    accepterId: number;
}

interface Response {

    checkedNotificationsTime: number;
    notifications: Notification[];
    users: {[userId: number]: User};

}

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    newNotifications: number;

    checkedNotificationsTime: number;
    notifications: Notification[];
    users: {[userId: number]: User} = {};

    private updateInterval;

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) {
        auth.onAuthenticatedListeners.push(() => {
            setTimeout(() => this.update(), 400); // to make badge animation animation better visible
            this.updateInterval = setInterval(() => this.update(), 5000);
        });
    }

    update() {
        if (!this.auth.session) return;

        this.http.post<Response>(API_URL + "notifications", {
            token: this.auth.session.token
        }).subscribe(res => {
            this.checkedNotificationsTime = res.checkedNotificationsTime;
            this.notifications = res.notifications.sort((a, b) => b.time - a.time);
            
            for (var id in res.users) {
                var user = res.users[id];

                var existing = this.users[id];
                this.users[id] = existing ? Object.assign(existing, user) : Object.assign(new User(), user);
            }

            var newNotifications = 0;
            for (var n of this.notifications) if (n.time > this.checkedNotificationsTime) newNotifications++;
            this.newNotifications = newNotifications;
        });
    }

    read() {
        this.http.post(API_URL + "notificationsRead", {
            token: this.auth.session.token
        }).subscribe(res => {});
    }

}
