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

        var user = this.route.snapshot.data.user as User;
        this.user = user;

        if (!user)
            return this.router.navigateByUrl("/tjiller-niet-gevonden", { replaceUrl: true });

        this.theme.applyThemeColor(user.r, user.g, user.b);

        this.tabs = [
            new Tab("Profiel", null, "./"),
            new Tab("Vriends", null, "./vriends", user.friends),
            new Tab("Uploods", null, "./uploods", user.uploads),
            new Tab("Groeps", null, "./groeps", user.groups)
        ];

    }

    get bannerStyle() {
        if (this.user && this.user.header) {
            return {
                'background': `linear-gradient(transparent, transparent, transparent, rgba(0, 0, 0, .4)), 
                                url('${this.user.headerUrl('large')}') transparent`,
                'backgroundSize': 'cover'
            }
        } else return {};
    }

}
