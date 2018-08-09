import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    @Input() users: User[];
    @Input() canLoadMoreUsers = true;

    @Output() loadMoreUsers = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

}
