import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { API_URL } from '../constants';
import { Comment } from '../models/comment';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CommentsAndVotesService {

    constructor(
        private http: HttpClient,
        private auth: AuthService
    ) { }

    getComments(entityId: number): Observable<Comment[]> {
        return this.http.post<Comment[]>(API_URL + "comments", { entityId }).map(comments => {
            
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

}
