import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-votes',
    templateUrl: './votes.component.html',
    styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit {

    @Input() entityId: number;

    constructor() { }

    ngOnInit() {
    }

}
