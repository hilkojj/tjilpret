import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { ThemeService } from './services/theme.service';
import { Title } from '@angular/platform-browser';
import { routerAnimation } from './animations/routerAnimation';
import { UtilsService } from './services/utils.service';
import { AuthService } from './services/auth.service';
import { THEME_COLOR } from './constants';

@Component({
    selector: 'tjille-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [routerAnimation]
})
export class AppComponent {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private theme: ThemeService,
        private utils: UtilsService,
        private title: Title,
        private auth: AuthService
    ) {

        this.subscribeToNavEnd();
    }

    private subscribeToNavEnd() {

        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map((route) => {
                while (route.firstChild) route = route.firstChild;
                return route;
            })
            .filter((route) => route.outlet === 'primary')
            .mergeMap((route) => route.data)
            .subscribe(data => {
                if ("title" in data)
                    this.title.setTitle(data["title"]);
                
                this.utils.navbarVisible = "showNavbar" in data && data["showNavbar"];

                if ("favColorTheme" in data && data["favColorTheme"] && this.auth.authenticated) {
                    var user = this.auth.session.user;
                    this.theme.applyThemeColor(user.r, user.g, user.b);

                } else if ("defaultTheme" in data && data["defaultTheme"]) {
                    this.theme.applyThemeColor(THEME_COLOR.r, THEME_COLOR.g, THEME_COLOR.b);
                }
                    
                this.theme.showAnimatedGradient(data["animatedGradient"] == true);
            });
    }

}
