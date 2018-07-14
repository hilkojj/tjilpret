import { Component, OnInit, Input } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { RouterUtilsService } from '../../services/router-utils.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Input() titleText: string = "";
    @Input() width: string = "100%";
    @Input() bw: boolean = false;

    constructor(
        private router: Router,
        private routerUtils: RouterUtilsService
    ) { }

    ngOnInit() {
    }

    back() {
        this.routerUtils.navigatedAfterFirstPage ? history.back() : this.router.navigateByUrl("/hoom");
    }

}
