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
import { ModalService } from './services/modal.service';

@Component({
    selector: 'tjille-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
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

        /*
            this code will make sure that a component will NOT 
            be reused  if a parameter (that is listed in data.dontReuse) changed.

            For example:

            /tjiller/6 -> /tjiller/241
            Component will NOT be reused

            /tjiller/6 -> /tjiller/6/vriends
            Component will be reused
        */ 
        this.router.routeReuseStrategy.shouldReuseRoute = (future, current) => {

            if (future.routeConfig != current.routeConfig)
                return false;

            var dontReuse: string[] = future.data.dontReuse;

            for (var i in dontReuse) {
                var param = dontReuse[i];
                if (future.params[param] != current.params[param])
                    return false;
            }

            return true;
        }

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
            });
    }

}
