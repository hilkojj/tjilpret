import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Title } from '../../../../node_modules/@angular/platform-browser';
import { Tab } from '../../components/tabs/tabs.component';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    tabs: Tab[];

    id: number;
    user: User;

    constructor(
        private route: ActivatedRoute,
        private users: UserService,
        private router: Router,
        private theme: ThemeService,
        private auth: AuthService,
        private title: Title,

        public modals: ModalService
    ) { }

    ngOnInit() {

        this.id = +this.route.snapshot.paramMap.get("id");

        this.users.userById(this.id).subscribe(user => {
            this.user = user;

            if (!user)
                return this.router.navigateByUrl("/tjiller-niet-gevonden", { replaceUrl: true });

            this.theme.applyThemeColor(user.r, user.g, user.b);

            this.tabs = [
                new Tab("Profiel", null, "./"),
                new Tab("Vriends", null, "./vriends", user.friends),
                new Tab("Uploods", null, "./uploods", user.uploads),
                new Tab("Groeps", null, "./groeps", user.groups)
            ]
        });

    }

}
