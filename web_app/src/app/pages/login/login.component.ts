import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterPath } from '../../app-routing.module';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    username: string;
    password: string;
    foundUser: User;

    constructor(
        private users: UserService,
        private themes: ThemeService,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() { }

    checkUsername() {
        this.users.userByUsername(this.username).subscribe(user => {
            this.foundUser = user;
            if (user == undefined) return;
            this.themes.applyThemeColor(user.r, user.g, user.b);
            this.username = user.username;
        });
    }

    login() { this.auth.login(this.username, this.password) }

    showRegister() { this.router.navigateByUrl(RouterPath.Register, { replaceUrl: true }) }

}