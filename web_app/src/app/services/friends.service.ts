import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { API_URL } from '../constants';
import { User } from '../models/user';
import { Observable } from '../../../node_modules/rxjs';

export enum FriendStatus {
    Friends,
    InviteRecieved,
    InviteSent,
    None
}

export interface Invite {
    time: number,
    userInfo: User
}

interface FriendsAndInvites {
    friends: {
        [id: number]: {
            since: number,
            inviter: boolean
        }
    },

    receivedInvites: {
        [id: number]: Invite
    }

    sentInvites: {
        [id: number]: Invite
    }
}

@Injectable({
    providedIn: 'root'
})
export class FriendsService {

    public receivedInvites: Invite[] = [];
    public sentInvites: Invite[] = [];

    private friendsAndInvites: FriendsAndInvites;
    private interval;
    private users: {[id: number]: User} = {};

    constructor(
        private auth: AuthService,
        private http: HttpClient
    ) {
        this.startInterval();
    }

    startInterval() {
        if (!this.interval) {
            this.interval = setInterval(() => this.update(), 8000);
            this.update();
        }
    }

    stopInterval() {
        clearInterval(this.interval);
    }

    update() {
        if (!this.auth.session) return this.stopInterval();

        this.http.post<FriendsAndInvites>(API_URL + "myFriendsAndInvites", {
            token: this.auth.session.token
        }).subscribe(res => {
            
            var loop = invitesObj => {
                for (var userId in invitesObj) {

                    var obj = invitesObj[userId];

                    if (userId in this.users) {
                        var user = this.users[userId];
                        this.users[userId] = obj.userInfo = Object.assign(user, obj.userInfo);
                    } else {

                        this.users[userId] = obj.userInfo = Object.assign(new User(), obj.userInfo);
                    }
                }

                return invitesObj;
            };

            res.receivedInvites = loop(res.receivedInvites);
            res.sentInvites = loop(res.sentInvites);

            this.receivedInvites = Object.values(res.receivedInvites).sort((a, b) => b.time - a.time);
            this.sentInvites = Object.values(res.sentInvites).sort((a, b) => b.time - a.time);

            this.friendsAndInvites = res;
        });
    }

    friendStatus(id: number): FriendStatus {

        if (!this.friendsAndInvites) return null;

        if (id in this.friendsAndInvites.friends)
            return FriendStatus.Friends;
        else if (id in this.friendsAndInvites.receivedInvites)
            return FriendStatus.InviteRecieved;
        else if (id in this.friendsAndInvites.sentInvites)
            return FriendStatus.InviteSent;
        else
            return FriendStatus.None;
    }

    invite(id: number) {
        this.http.post(API_URL + "invite", {
            invitedID: id,
            token: this.auth.session.token
        }).subscribe(res => {
            if (res["success"]) this.update();
        });
    }

    undoInvite(id: number) {
        this.http.post(API_URL + "undoInvite", {
            invitedID: id,
            token: this.auth.session.token
        }).subscribe(res => {
            if (res["success"]) this.update();
        });
    }

    confirm(id: number, accept: boolean) {
        this.http.post(API_URL + "confirmFriendship", {
            inviterID: id,
            token: this.auth.session.token,
            accept
        }).subscribe(res => {
            if (res["success"]) this.update();
        });
    }

    remove(id: number) {
        this.http.post(API_URL + "removeFriend", {
            friendID: id,
            token: this.auth.session.token
        }).subscribe(res => {
            if (res["success"]) this.update();
        });
    }

    getFriendsOf(userId: number, query: string, page: number): Observable<User[]> {
        return this.http.post<User[]>(API_URL + "friendsOf/" + userId, { q: query, page }).map(friends => {
            for (var i in friends)
                friends[i] = Object.assign(new User(), friends[i]);
            return friends
        });
    }

}
