import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import 'rxjs/add/observable/of';
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Post } from "../models/post";
import { PostsService } from "../services/posts.service";

@Injectable()
export class PostResolver implements Resolve<Observable<Post>> {

    constructor(
        private posts: PostsService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Post> {
        var id = +route.paramMap.get("id");
        return this.posts.preLoadedPost && id == this.posts.preLoadedPost.id ?
            Observable.of(this.posts.preLoadedPost)
            :
            this.posts.getPostById(id);
    }

}