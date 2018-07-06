import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';

@Component({
    selector: 'app-username',
    templateUrl: './username.component.html',
    styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit {

    @Input() user: User;
    @Input() fontSize: string;

    math: Math = Math;
    classes: string[] = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    time = Date.now() / 1000 | 0;

    constructor() { }

    ngOnInit() {
    }

    parseInt(i): number {
        return parseInt(i);
    }

}
