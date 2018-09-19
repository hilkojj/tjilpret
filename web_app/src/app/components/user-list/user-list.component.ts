import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { User } from '../../models/user';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

    @Input() users: User[];
    @Input() canLoadMoreUsers = true;

    @Output() loadMoreUsers = new EventEmitter();

    inViewport = false;

    constructor() { }

    private interval;

    ngOnInit() {
        this.interval = setInterval(() => {

            if (this.inViewport && this.canLoadMoreUsers) this.loadMoreUsers.emit();

        }, 500);
    }

    ngOnDestroy() {
        clearInterval(this.interval)
    }

}
