import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterPath } from '../../app-routing.module';
import { User } from '../../models/user';

@Component({
    selector: 'app-choose-recent-user',
    templateUrl: './choose-recent-user.component.html',
    styleUrls: ['./choose-recent-user.component.css']
})
export class ChooseRecentUserComponent implements OnInit {

    recentUsers: User[] = [];
    validated: boolean = false;

    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.auth.recentUsers == undefined)
            this.auth.validateTokens(() => this.createUserArray());
        else this.createUserArray();
    }

    createUserArray() {
        this.recentUsers = [];
        this.validated = true;
        for (var id in this.auth.recentUsers)
            this.recentUsers.push(this.auth.recentUsers[id]);
    }

    chooseUser(user: User) {
        var token = this.auth.savedTokens[user.id];
        this.auth.createSession(token, user);
    }

    showLogin() { this.router.navigate([RouterPath.Login], { replaceUrl: true }) }

}
