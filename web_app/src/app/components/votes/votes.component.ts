import { Component, OnInit, Input } from '@angular/core';
import { Votes } from '../../models/votes';
import { CommentsAndVotesService } from '../../services/comments-and-votes.service';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-votes',
    templateUrl: './votes.component.html',
    styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit {

    @Input() entityId: number;
    @Input() votes: Votes;

    @Input() extended: boolean;

    upVoters: User[];
    downVoters: User[];

    constructor(
        private service: CommentsAndVotesService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        if (!this.votes && this.entityId) {

            var ob = !this.extended ?
                this.service.getVotesAndVoters(this.entityId)
                :
                this.service.getVotesAndVoters(this.entityId, 10);

            ob.subscribe(votesAndVoters => {
                this.votes = votesAndVoters.votes;
                this.upVoters = votesAndVoters.upVoters.filter(voter => voter.id != this.auth.session.user.id);
                this.downVoters = votesAndVoters.downVoters.filter(voter => voter.id != this.auth.session.user.id);
            });
        }
    }

    get score(): string {
        if (!this.votes) return "";
        var s = this.votes.upVotes - this.votes.downVotes;
        return s < 0 ? s + "" : "+" + s;
    }

    vote(vote: number) {
        this.service.vote(this.entityId, vote).subscribe(votes => this.votes = votes);
    }

    percentage(numberOfVotes: number) {
        return (numberOfVotes / (this.votes.upVotes + this.votes.downVotes) * 100 | 0) + "%";
    }

}
