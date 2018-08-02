import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

    post: Post;

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.post = this.route.snapshot.data.post as Post;
    }

}
