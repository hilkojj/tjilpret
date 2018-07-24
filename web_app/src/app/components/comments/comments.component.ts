import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommentsAndVotesService } from '../../services/comments-and-votes.service';
import { Comment } from '../../models/comment';
import { GiphyService, Giphy } from '../../services/giphy.service';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

    @Input() entityId: number;

    commentInput: { [entityId: number]: string } = {};
    commentGiphy: { [entityId: number]: Giphy } = {};
    comments: Comment[];

    constructor(
        public auth: AuthService,
        public service: CommentsAndVotesService,
        private giphy: GiphyService
    ) { }

    ngOnInit() {
        this.loadComments();
    }

    loadComments() {
        this.service.getComments(this.entityId).subscribe(comments => {
            this.comments = comments;
            this.commentInput = {};
            this.commentGiphy = {};
        });
    }

    postComment(entityId: number) {
        var giphy = this.commentGiphy[entityId];
        this.service.postComment(
            entityId,
            this.commentInput[entityId],
            giphy ? giphy.id : null

        ).subscribe(success => {
            this.loadComments();
        });
    }

    writeCommentLabel(commentOn: Comment): string {
        if (!commentOn.subComments) return `Reageer op ${commentOn.user.username}`;
        else {
            var users: { [username: string]: boolean } = {};
            users[commentOn.user.username] = true;
            for (var i in commentOn.subComments) {
                var sub = commentOn.subComments[i];

                if (!users[sub.user.username]) users[sub.user.username] = true;
            }

            var usernames = Object.keys(users);

            var label = `Reageer op ${usernames[0]}`;
            if (usernames.length > 3) return `${label} en nog ${usernames.length - 1} anderen`;
            else {
                var j = 0;
                for (var username of usernames) {
                    if (j++ == 0) continue;

                    label += (j == usernames.length ? ' en ' : ', ') + username;
                }
                return label;
            }
        }
    }

    showReplyInput(commentOn: number) {
        this.commentInput[commentOn] = "";
        setTimeout(() => {

            var input = document.getElementById("comment-input-" + commentOn);
            input.focus();

        }, 20);
    }

    includeGiphy(commentOn: number) {
        this.giphy.openGiphySearch().then(giphy => {
            this.commentGiphy[commentOn] = giphy;
        });
    }

}
