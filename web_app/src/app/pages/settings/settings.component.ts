import { Component, OnInit } from '@angular/core';
import { AuthService, PartialToken } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

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

    constructor(
        public auth: AuthService,
        public modals: ModalService
    ) { }

    ngOnInit() {

        this.auth.getCurrentEmail().subscribe(email => this.currentEmail = email);
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

}
