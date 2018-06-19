import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterPath } from '../../app-routing.module';
import { UserService } from '../../services/user.service';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    username: string = "";
    password: string = "";
    email: string = "";

    constructor(
        private router: Router,
        private users: UserService,
        private utils: UtilsService,
        private auth: AuthService
    ) { }

    ngOnInit() {
    }

    checkUsername() {
        if (this.username == "") return;
        this.users.usernameExists(this.username).subscribe(exists => {
            if (exists)
                this.utils.errorToast(`'${this.utils.htmlText(this.username)}' bestat al :(`, 4000);
            else
                this.utils.successToast(`'${this.utils.htmlText(this.username)}' is bescrhikbaar`, 3000);
        });
    }

    register() {
        this.auth.register(this.username, this.password, this.email);
    }

    showLogin() { this.router.navigateByUrl(RouterPath.Login, { replaceUrl: true }) }

}
