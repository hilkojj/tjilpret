import { Component, OnInit } from '@angular/core';
import { AuthService, PartialToken } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    currentEmail: string;

    changeEmailVars: { password: string, newEmail: string } = {
        password: "",
        newEmail: ""
    }

    changePasswordVars: { currentPassword: string, newPassword: string } = {
        currentPassword: "",
        newPassword: ""
    }
    tokenHistory: PartialToken[];

    browserIconsUrl = "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/45.10.0/";

    browsers: {
        regex: RegExp,
        icon: string
    }[] = [
            {
                regex: /chrome/,
                icon: "chrome/chrome.svg"
            },
            {
                regex: /chromium/,
                icon: "chromium/chromium_256x256.png"
            },
            {
                regex: /edge/,
                icon: "edge/edge.svg"
            },
            {
                regex: /firefox/,
                icon: "firefox/firefox.svg"
            },
            {
                regex: /opera/,
                icon: "opera/opera.svg"
            },
            {
                regex: /safari/,
                icon: "safari/safari_256x256.png"
            },
            {
                regex: /samsumg/,
                icon: "samsung-internet/samsung-internet.svg"
            }
        ];

    getBrowserIcon(readableUserAgent: string): string {
        for (var i in this.browsers) {
            var b = this.browsers[i];
            if (b.regex.test(readableUserAgent.toLowerCase()))
                return this.browserIconsUrl + b.icon;
        }
    }

    constructor(
        public auth: AuthService,
        public modals: ModalService,
        private utils: UtilsService
    ) { }

    ngOnInit() {

        this.auth.getCurrentEmail().subscribe(email => this.currentEmail = email);
        this.getTokenHistory();

    }

    getTokenHistory() {
        this.auth.getTokenHistory().subscribe(tokenHistory => this.tokenHistory = tokenHistory);
    }

    changeEmail() {
        let email = this.changeEmailVars.newEmail;
        this.auth.changeEmail(
            this.changeEmailVars.password,
            email,
            success => {
                if (success) {
                    this.currentEmail = email;
                    history.back();
                }
            }
        );
    }

    changePassword() {
        this.auth.changePassword(
            this.changePasswordVars.currentPassword,
            this.changePasswordVars.newPassword, null
        );
    }

    logoutEverywhere() {
        if (confirm("Wil je overal uitloggen?")) this.auth.logoutEverywhere();
    }

    isThisSession(p: PartialToken) {
        return (this.auth.session.token + "").startsWith(p.partialToken + "");
    }

    logout(p: PartialToken) {
        this.auth.logout(p).subscribe(success => {
            if (success) {
                this.utils.successToast("Uitgelogd", 2000);

                if (this.isThisSession(p))
                    window.location.href = "/";
                else this.getTokenHistory();
            }
        });
    }

}
