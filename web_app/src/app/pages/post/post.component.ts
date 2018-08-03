import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../models/post';
import { Title } from '../../../../node_modules/@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { SpeechService } from '../../services/speech.service';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

    post: Post;
    poster: User;
    numberOfComments = 0;

    randomPosts: Post[];

    // Edit post:
    newTitle;
    newDescription;

    constructor(
        public auth: AuthService,
        public service: PostsService,
        public users: UserService,
        public posts: PostsService,
        public speech: SpeechService,
        public modals: ModalService,

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
        this.posts.registerView(this.post.id);

        this.newTitle = this.post.title;
        this.newDescription = this.post.description;

        this.service.randomPosts(10).subscribe(
            posts => this.randomPosts = posts.filter(post => post.id != this.post.id)
        );
    }

    edit() {
        this.service.editPost(this.post.id, this.newTitle, this.newDescription).subscribe(done => {

            this.service.getPostById(this.post.id).subscribe(post => this.post = post);

        });
        this.modals.hideModal();
    }

    randomPost() {
        this.service.randomPosts(1).subscribe(posts => this.service.showPost(posts[0]));
    }

}
