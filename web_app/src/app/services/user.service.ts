import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private http: HttpClient
    ) { }

    userByUsername(username: string): Observable<User> {
        return this.http.post(
            API_URL + "userInfo", { username: username }
        ).map(res => res["found"] ? Object.assign(new User(), res["userInfo"]) : undefined);
    }

    usernameExists(username: string): Observable<boolean> {
        return this.http.post(
            API_URL + "usernameExists", { username: username }
        ).map(res => res["exists"] == true);
    }

}
