import { Component, OnInit, Host } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../../services/modal.service';
import { ThemeService } from '../../services/theme.service';

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
        this.theme.update();
    }

    constructor(
        public auth: AuthService,
        @Host() public modal: ModalComponent,
        public modals: ModalService,
        private theme: ThemeService
    ) { }

    ngOnInit() {
    }

}
