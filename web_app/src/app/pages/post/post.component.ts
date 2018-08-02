import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../models/post';
import { Title } from '../../../../node_modules/@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

    post: Post;
    poster: User;

    constructor(
        public auth: AuthService,
        public service: PostsService,
        public users: UserService,

        private route: ActivatedRoute,
        private router: Router,
        private title: Title
    ) { }

    ngOnInit() {

        this.post = this.route.snapshot.data.post as Post;

        if (!this.post)
            return this.router.navigateByUrl("/uplood-niet-gevonden", { replaceUrl: true });

        this.title.setTitle(this.post.title);

        this.users.userById(this.post.uploadedBy).subscribe(user => this.poster = user);
    }

}
