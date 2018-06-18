import { Injectable } from '@angular/core';
import * as Cookies from 'js-cookie';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterPath } from '../app-routing.module';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { User } from '../models/user';
import { UtilsService } from './utils.service';
import { Session } from '../models/session';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements CanActivate {

    session: Session;

    private returnUrl: string;

    constructor(
        private router: Router,
        private http: HttpClient,
        private utils: UtilsService
    ) { }

    get authenticated(): boolean {
        return typeof this.session == "object";
    }

    get lastUserID(): number { return parseInt(Cookies.get("last_user")) }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authenticated) return true;
        this.returnUrl = state.url;
        this.authNeeded();
        return false;
    }

    authNeeded() {
        var savedTokens = Cookies.getJSON("tokens");
        if (typeof savedTokens == "object") {

            this.http.post(
                API_URL + "validateTokens",
                { tokens: savedTokens }
            ).subscribe(res => {
                console.log(res);
                var lastUserID: number = this.lastUserID;
                if (lastUserID in res)
                    this.createSession(savedTokens[lastUserID], res[lastUserID]);
            });

        } else this.router.navigate([RouterPath.Login]);
    }

    createSession(token: number, user: User) {
        this.session = new Session(token, user);

        var tokens = Cookies.getJSON("tokens");
        if (typeof tokens != "object") tokens = {};
        tokens[user.id] = token;
        Cookies.set("tokens", tokens, { expires: 1000 });
        Cookies.set("last_user", user.id);
        console.log(this.returnUrl);
        console.log(typeof this.session);
        this.router.navigateByUrl(this.returnUrl == undefined ? "" : this.returnUrl);
    }

    login(username: string, password: string) {
        this.http.post(
            API_URL + "login",
            { username: username, password: password }
        ).subscribe(res => {
            if ("error" in res)
                this.utils.errorToast(res["error"], 4000);
            else if (res["success"])
                this.createSession(res["token"], res["userInfo"]);
        });
    }

}
