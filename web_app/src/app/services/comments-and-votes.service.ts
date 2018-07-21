import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { API_URL } from '../constants';

@Injectable({
    providedIn: 'root'
})
export class CommentsAndVotesService {

    constructor(
        private http: HttpClient
    ) { }

    getComments(entityId: number): Observable<Comment[]> {
        return this.http.post<Comment[]>(
            API_URL + "comments", { entityId }
        );
    }

}
