import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { User } from '../../models/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    username: string;
    password: string;
    foundUser: User;

    private prevUsername: string;

    constructor(
        private users: UserService
    ) { }

    ngOnInit() {
    }

    showProfilePic() {
        if (this.username == this.prevUsername) return;

        this.users.userByUsername(this.username).subscribe(user => this.foundUser = user);

        this.prevUsername = this.username;
    }

    showRealUsername() {
        if (this.foundUser != undefined) this.username = this.foundUser.username;
    }

    login() {
        console.log(this.username, this.password);
    }

}