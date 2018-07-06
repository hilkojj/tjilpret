import { Component, OnInit, Host } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

    constructor(
        private auth: AuthService,
        @Host() private modal: ModalComponent
    ) { }

    ngOnInit() {
    }

}
