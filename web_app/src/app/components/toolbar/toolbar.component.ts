import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { RouterUtilsService } from '../../services/router-utils.service';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements AfterViewInit {

    @Input() titleText: string = "";
    @Input() width: string = "100%";
    @Input() bw: boolean = false;
    @Input() backIcon = "arrow_back";

    private navigated: boolean;

    constructor(
        private router: Router,
        private routerUtils: RouterUtilsService,
        private modals: ModalService
    ) { }

    ngAfterViewInit() {
        this.navigated = this.routerUtils.navigatedAfterFirstPage;
    }

    back() {
        this.navigated || this.modals.activeModal != null ? history.back() : this.router.navigateByUrl("/hoom");
    }

}
