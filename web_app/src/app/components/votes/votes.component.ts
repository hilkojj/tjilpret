import { Component, OnInit, Input } from '@angular/core';
import { Votes } from '../../models/votes';
import { CommentsAndVotesService } from '../../services/comments-and-votes.service';

@Component({
    selector: 'app-votes',
    templateUrl: './votes.component.html',
    styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit {

    @Input() entityId: number;
    @Input() votes: Votes;

    constructor(
        private service: CommentsAndVotesService
    ) { }

    ngOnInit() {
    }

    get score(): string {
        var s = this.votes.upVotes - this.votes.downVotes;
        return s < 0 ? s + "" : "+" + s;
    }

    vote(vote: number) {
        this.service.vote(this.entityId, vote).subscribe(votes => this.votes = votes);
    }

}
