import { Component, OnInit, Host } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

    get darkTheme(): boolean {
        return localStorage.getItem("darkTheme") == "true";
    }

    set darkTheme(value: boolean) {
        localStorage.setItem("darkTheme", "" + value);
    }

    constructor(
        private auth: AuthService,
        @Host() private modal: ModalComponent,
        private modals: ModalService
    ) { }

    ngOnInit() {
    }

}