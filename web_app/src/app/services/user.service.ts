import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { Router } from '../../../node_modules/@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    preLoadedProfileUser: User;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    showProfile(user: User) {
        this.preLoadedProfileUser = user;
        this.router.navigateByUrl("/tjiller/" + user.id);
    }

    userByUsername(username: string): Observable<User> {
        return this.http.post(
            API_URL + "userInfo", { username: username }
        ).map(res => res["found"] ? Object.assign(new User(), res["userInfo"]) : undefined);
    }

    userById(id: number): Observable<User> {
        return this.http.post(
            API_URL + "userInfo", { id }
        ).map(res => res["found"] ? Object.assign(new User(), res["userInfo"]) : undefined);
    }

    usernameExists(username: string): Observable<boolean> {
        return this.http.post(
            API_URL + "usernameExists", { username: username }
        ).map(res => res["exists"] == true);
    }

    searchUsers(q: string, page?: number, colorClass?: number | string, sortBy?: string, desc?: boolean): Observable<User[]> {
        return this.http.post<User[]>(API_URL + "searchPeople", {
            q, colorClass, sortBy, page, desc
        }).map(users => {

            for (var i in users)
                users[i] = Object.assign(new User(), users[i]);

            return users;
        });
    }

}
