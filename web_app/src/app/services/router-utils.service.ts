import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { Title } from '@angular/platform-browser';
import { ThemeService } from './theme.service';
import { UtilsService } from './utils.service';
import { THEME_COLOR } from '../constants';

@Injectable({
    providedIn: 'root'
})
export class RouterUtilsService {

    private _navigatedAfterFirstPage = false;
    private firstNavigation = false;

    /**
     * @returns Indicates if a navigation happened AFTER the first page was shown. (Different from Router.navigated)
     */
    get navigatedAfterFirstPage(): boolean {
        return this._navigatedAfterFirstPage;
    }

    constructor(
        private utils: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private theme: ThemeService,
        private title: Title,
        private auth: AuthService
    ) { }

    initialize() {
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

                // stop scroll restoration:
                history.scrollRestoration = "manual";

                if ("title" in data)
                    this.title.setTitle(data["title"]);

                this.utils.navbarVisible = "showNavbar" in data && data["showNavbar"];

                if ("favColorTheme" in data && data["favColorTheme"] && this.auth.authenticated) {
                    this.theme.applyFavColor(this.auth.session.user);

                } else if ("defaultTheme" in data && data["defaultTheme"]) {
                    this.theme.applyThemeColor(THEME_COLOR.r, THEME_COLOR.g, THEME_COLOR.b);
                }
                else this.theme.update();

                if (!this.firstNavigation)
                    this.firstNavigation = true;
                else this._navigatedAfterFirstPage = true
            });


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

}
