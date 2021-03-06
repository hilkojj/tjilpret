import { Component } from '@angular/core';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { routerAnimation } from './animations/routerAnimation';
import { UtilsService } from './services/utils.service';
import { RouterUtilsService } from './services/router-utils.service';
import { ServiceWorkerService } from './services/service-worker.service';

@Component({
    selector: 'tjille-app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [routerAnimation]
})
export class AppComponent {

    constructor(
        public utils: UtilsService,
        public routerUtils: RouterUtilsService,
        private swService: ServiceWorkerService // this way the constructor will always be called
    ) {
        this.routerUtils.initialize();
    }

    onActivate() {
        window.scrollTo(0, 0);
    }

}
