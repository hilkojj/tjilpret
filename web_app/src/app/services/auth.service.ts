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

    private _session: Session;
    get session(): Session { return this._session }

    private _recentUsers: { [id: number]: User };
    get recentUsers(): { [id: number]: User } { return this._recentUsers }

    private returnUrl: string;

    get authenticated(): boolean { return typeof this._session == "object" }

    get lastUserID(): number { return parseInt(localStorage.getItem("last_user")) }

    get savedTokens(): { [userID: number]: number } {
        var saved = localStorage.getItem("tokens");
        return saved == null ? {} : JSON.parse(saved);
    }

    constructor(
        private router: Router,
        private http: HttpClient,
        private utils: UtilsService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (route.data["disallowAuth"]) {

            return !this.authenticated;

        } else {
            if (this.authenticated) return true;
            this.returnUrl = state.url;
            this.authNeeded();
            return false;
        }
    }

    authNeeded() {
        if (Object.keys(this.savedTokens).length > 0) {

            this.validateTokens(() => {

                var validatedTokens = this.savedTokens;
                var lastUserID = this.lastUserID;
                if (lastUserID in validatedTokens)
                    this.createSession(
                        validatedTokens[lastUserID],
                        this._recentUsers[lastUserID]
                    );

                else this.router.navigate([RouterPath.ChooseRecentUser], { replaceUrl: true });
            });

        } else this.router.navigate([RouterPath.Login], { replaceUrl: true });
    }

    createSession(token: number, user: User) {
        this._session = new Session(token, user);
        Cookies.set("token", token);

        var tokens = this.savedTokens;
        tokens[user.id] = token;
        localStorage.setItem("tokens", JSON.stringify(tokens));
        localStorage.setItem("last_user", user.id + "");
        this.router.navigateByUrl(this.returnUrl == undefined ? "" : this.returnUrl, {
            replaceUrl: true
        });
    }

    login(username: string, password: string) {
        this.http.post(
            API_URL + "login",
            { username: username, password: password }
        ).subscribe(res => this.loginRegisterCallback(res));
    }

    register(username: string, password: string, email: string) {
        this.http.post(
            API_URL + "register", { username: username, password: password, email: email }
        ).subscribe(res => this.loginRegisterCallback(res));
    }

    private loginRegisterCallback(res) {
        if ("error" in res)
            this.utils.errorToast(res["error"], 4000);
        else if (res["success"])
            this.createSession(res["token"], res["userInfo"]);
    }

    validateTokens(callback) {
        var oldTokens = this.savedTokens;
        this.http.post(
            API_URL + "validateTokens",
            { tokens: oldTokens }
        ).subscribe(res => {
            this._recentUsers = {};
            for (var id in res)
                this._recentUsers[id] = Object.assign(new User(), res[id]);

            var newTokens = {};
            for (var id in oldTokens)
                if (id in res)
                    newTokens[id] = oldTokens[id];

            localStorage.setItem("tokens", JSON.stringify(newTokens));

            callback();
        });
    }

}
