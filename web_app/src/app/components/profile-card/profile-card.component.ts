import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {

    @Input() user: User;

    constructor(
        public auth: AuthService,
        public service: UserService
    ) { }

    ngOnInit() {
    }

    get bannerStyle() {
        if (this.user && this.user.header) {
            return {
                'backgroundImage': `url('${this.user.headerUrl('small')}')`
            }
        } else return {};
    }

}
