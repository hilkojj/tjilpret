import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Title } from '../../../../node_modules/@angular/platform-browser';
import { Tab } from '../../components/tabs/tabs.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    tabs: Tab[] = [
        new Tab("Profiel", "", "./"),
        new Tab("Vriends", "group", "./vriends"),
        new Tab("Uploods", "subscriptions", "./uploods"),
        new Tab("Groeps", "group", "./groeps")
    ];

    id: number;
    user: User;
    notFound = false;

    constructor(
        private route: ActivatedRoute,
        private users: UserService,
        private router: Router,
        private theme: ThemeService,
        private auth: AuthService,
        private title: Title
    ) { }

    ngOnInit() {

        this.id = +this.route.snapshot.paramMap.get("id");

        this.users.userById(this.id).subscribe(user => {
            this.user = user;
            this.notFound = !user;
            
            var themeUser = user ? user : this.auth.session.user;
            this.theme.applyThemeColor(themeUser.r, themeUser.g, themeUser.b);

            if (this.notFound) this.title.setTitle("Tjiller nit gevonvdn");
        });

    }

}
