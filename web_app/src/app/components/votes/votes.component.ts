import { Component, OnInit, Input } from '@angular/core';
import { Votes, Voter } from '../../models/votes';
import { CommentsAndVotesService } from '../../services/comments-and-votes.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { User } from '../../models/user';

@Component({
    selector: 'app-votes',
    templateUrl: './votes.component.html',
    styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit {

    @Input() entityId: number;
    @Input() votes: Votes;

    @Input() extended: boolean;

    upVoters: Voter[];
    downVoters: Voter[];

    modalHash: string;
    modalUpVoters: boolean = true; // show the upvoters or the downvoters in the modal?
    modalVoters: User[] = [];
    modalPage = 0;
    canLoadMoreVoters = true;

    constructor(
        public modals: ModalService,

        private service: CommentsAndVotesService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        if (!this.votes && this.entityId) {

            var ob = !this.extended ?
                this.service.getVotesAndVoters(this.entityId)
                :
                this.service.getVotesAndVoters(this.entityId, 7);

            ob.subscribe(votesAndVoters => {
                this.votes = votesAndVoters.votes;
                this.upVoters = votesAndVoters.upVoters.filter(voter => voter.user.id != this.auth.session.user.id);
                this.downVoters = votesAndVoters.downVoters.filter(voter => voter.user.id != this.auth.session.user.id);
            });

            this.modalHash = "waardering-" + this.entityId;
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
        return numberOfVotes / (this.votes.upVotes + this.votes.downVotes) * 100;
    }

    get modalTitle(): string {
        if (this.modalUpVoters)

            return this.votes.upVotes + ' ' + (this.votes.upVotes == 1 ? 'waardering' : 'waarderingen');

        else

            return this.votes.downVotes + ' ' + (this.votes.downVotes == 1 ? 'minachting' : 'minachtingen');
    }

    showVotersModal(showUpVoters: boolean) {
        this.modalVoters = [];
        this.modalUpVoters = showUpVoters;
        this.modalPage = 0;
        this.canLoadMoreVoters = true;
        this.modals.showModal(this.modalHash);
        this.loadMoreVoters();
    }

    loadMoreVoters() {
        var limit = 16;
        this.service.getVoters(this.entityId, this.modalUpVoters, limit, limit * this.modalPage++).subscribe(voters => {
            var users = voters.map(voter => voter.user);
            this.modalVoters = this.modalVoters.concat(users);
            this.canLoadMoreVoters = users.length == limit;
        });
    }

}
