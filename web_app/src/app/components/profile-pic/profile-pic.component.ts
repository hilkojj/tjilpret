import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { User } from '../../models/user';

@Component({
    selector: 'app-profile-pic',
    templateUrl: './profile-pic.component.html',
    styleUrls: ['./profile-pic.component.scss']
})
export class ProfilePicComponent implements OnInit {

    @Input() user: User;
    @Input() size: string;
    @Input() dim: string = "med";
    @Input() borderWidth: string = "0";

    constructor() { }

    ngOnInit() {
    }

}
