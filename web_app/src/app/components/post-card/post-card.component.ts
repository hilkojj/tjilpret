import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts.service';

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

    @Input() post: Post;

    constructor(
        public posts: PostsService
    ) { }

    ngOnInit() {
    }

    get typeIcon() {
        return this.post.type == "img" ? "image" : (this.post.type == "vid" ? "movie" : "gif");
    }

    get typeColor() {
        return this.post.type == "img" ? "green accent-3" : (this.post.type == "vid" ? "indigo accent-4" : "deep-orange accent-3");
    }

}
