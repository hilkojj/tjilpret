import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { API_URL } from '../constants';
import { Comment } from '../models/comment';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { Votes } from '../models/votes';

@Injectable({
    providedIn: 'root'
})
export class CommentsAndVotesService {

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) { }

    getComments(entityId: number): Observable<Comment[]> {
        var token = this.auth.session.token;
        return this.http.post<Comment[]>(API_URL + "comments", { entityId, token }).map(comments => {
            
            const loop = comments => {
                for (var i in comments) {
                    var comment: Comment = comments[i];
                    comment.user = Object.assign(new User(), comment.user);
                    comment.subComments = loop(comment.subComments);
                }
                return comments;
            }
            return loop(comments).sort((a, b) => a.time < b.time);
        });
    }

    postComment(entityId: number, comment: string, giphyId: string): Observable<boolean> {
        return this.http.post(API_URL + "postComment", {
            token: this.auth.session.token,
            entityId,
            comment,
            giphy: giphyId
        }).map(res => res["success"]);
    }

    deleteComment(commentId: number): Observable<boolean> {
        return this.http.post(API_URL + "deleteComment", {
            token: this.auth.session.token,
            commentId
        }).map(res => res["success"]);
    }

    vote(entityId: number, vote: number): Observable<Votes> {
        return this.http.post<Votes>(API_URL + "vote", {
            token: this.auth.session.token,
            entityId,
            vote
        });
    }

}
