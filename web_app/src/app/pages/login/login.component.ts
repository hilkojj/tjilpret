import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { User } from '../../models/user';
import { ThemeService } from '../../services/theme/theme.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RouterPath } from '../../app-routing.module';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
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

    ngOnInit() {
        if (this.auth.authenticated) return this.router.navigate([RouterPath.Home]);
    }

    checkUsername() {
        this.users.userByUsername(this.username).subscribe(user => {
            this.foundUser = user;
            if (user == undefined) return;
            this.themes.applyThemeColor(user.r, user.g, user.b);
            this.username = user.username;
        });
    }

    login() { this.auth.login(this.username, this.password) }

}