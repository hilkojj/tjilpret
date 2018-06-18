import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { ThemeService } from './services/theme.service';

@Component({
    selector: 'tjille-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private themeService: ThemeService
    ) {

        this.subscribeToNavEnd();
        // themeService.applyThemeColor(10, 200, 100);

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
            .subscribe(event => {
                console.log(event);
            });
    }

}
