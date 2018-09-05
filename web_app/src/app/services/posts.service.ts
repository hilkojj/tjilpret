import { Injectable } from '@angular/core';
import { Post, Category } from '../models/post';
import { CONTENT_URL, API_URL } from '../constants';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';

const POST_UPLOADS_URL = CONTENT_URL + "post_uploads/";

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    preLoadedPost: Post;

    constructor(
        private http: HttpClient,
        private router: Router,
        private auth: AuthService,
        private utils: UtilsService
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

    editPost(id: number, title?: string, description?: string): Observable<boolean> {
        var body = {
            token: this.auth.session.token,
            postId: id
        } as any;

        if (title) body.title = title;
        if (description) body.description = description;

        return this.http.post(API_URL + "editPost", body).map((res: any) => {
            if (title && !res.titleUpdated)
                this.utils.errorToast("Fout bij titel opslaan", 3000);

            if (description && !res.descriptionUpdated)
                this.utils.errorToast("Fout bij descriptie opslaan", 3000);

            return true;
        });
    }

    randomPosts(number: number): Observable<Post[]> {
        return this.http.post<Post[]>(API_URL + "randomPosts", { number });
    }

    // q: query
    // type: img, vid, gif or any
    // sortBy: score, time or comments
    searchPosts(
        q: string, type: string, sortBy: string, desc: boolean, categoryId?: number
    ): Observable<Post[]> {

        return this.http.post<Post[]>(API_URL + "searchPosts", {
            q, type, sortBy, desc, categoryId: categoryId || "any"
        });
    }

    vidToBeUploaded: File;

    newVideoPost(vid: File) {
        if (!vid) return;

        this.vidToBeUploaded = vid;
        this.router.navigateByUrl("/niwe-vido");
    }

    imgToBeUploaded: File;

    newImgPost(img: File) {
        if (!img) return;

        this.imgToBeUploaded = img;
        this.router.navigateByUrl("/niwe-plaatje");
    }

    getCategories(): Observable<Category[]> {
        return this.http.post<Category[]>(API_URL + "/postCategories", {});
    }

    uploadImgPost(file: File, title: string, description: string, categoryId: number, rotate: number): Observable<any> {

        var fd = new FormData();
        fd.append("file", file, "file");
        
        var data = {
            token: this.auth.session.token, title, description, categoryId, rotate
        }
        for (var key in data) fd.append(key, data[key]);

        return this.http.post(API_URL + "/uploadImagePost", fd);
    }

    uploadVidPost(
        file: File, title: string, description: string, categoryId: number, thumbnailPercentage: number
    ): Observable<HttpEvent<any>> {

        var fd = new FormData();
        fd.append("file", file, "file");
        
        var data = {
            token: this.auth.session.token, title, description, categoryId, thumbnailPercentage
        }
        for (var key in data) fd.append(key, data[key]);

        return this.http.request(
            new HttpRequest("POST", API_URL + "/uploadVideoPost", fd, {
                reportProgress: true
            })
        );
    }

}
