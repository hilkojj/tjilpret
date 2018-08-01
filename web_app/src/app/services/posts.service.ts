import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { CONTENT_URL, API_URL } from '../constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

const POST_UPLOADS_URL = CONTENT_URL + "post_uploads/";

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor(
        private http: HttpClient
    ) { }

    getThumbnailPath(post: Post): string {
        return POST_UPLOADS_URL + post.thumbnailPath;
    }

    getPostsOfUser(userId: number, q: string, page: number, orderBy: string): Observable<Post[]> {
        return this.http.post<Post[]>(API_URL + "postsOfUser/" + userId, {
            q, page, orderBy
        });
    }

}
