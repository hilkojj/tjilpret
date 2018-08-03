import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { CONTENT_URL, API_URL } from '../constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

const POST_UPLOADS_URL = CONTENT_URL + "post_uploads/";

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    preLoadedPost: Post;

    constructor(
        private http: HttpClient,
        private router: Router,
        private auth: AuthService
    ) { }

    getThumbnailPath(post: Post): string {
        return POST_UPLOADS_URL + post.thumbnailPath;
    }

    getFilePath(post: Post): string {
        return POST_UPLOADS_URL + post.path;
    }

    getPostsOfUser(userId: number, q: string, page: number, orderBy: string): Observable<Post[]> {
        return this.http.post<Post[]>(API_URL + "postsOfUser/" + userId, {
            q, page, orderBy
        });
    }

    getPostById(id: number): Observable<Post> {
        return this.http.post(API_URL + "post/" + id, {}).map(res =>
            res["found"] ? res["post"] as Post : null
        );
    }

    showPost(post: Post) {
        this.preLoadedPost = post;
        this.router.navigateByUrl("/uplood/" + post.id);
    }

    registerView(id: number) {
        this.http.post(API_URL + "registerPostView", {
            token: this.auth.session.token,
            postId: id
        }).subscribe();
    }

}
