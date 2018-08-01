import { Component, OnInit, Host } from '@angular/core';
import { ProfileComponent } from '../profile.component';
import { Title } from '@angular/platform-browser';
import { Post } from '../../../models/post';
import { Search, Filter } from '../../../components/search/search.component';
import { PostsService } from '../../../services/posts.service';

@Component({
    selector: 'app-profile-uploads',
    templateUrl: './profile-uploads.component.html',
    styleUrls: ['./profile-uploads.component.scss']
})
export class ProfileUploadsComponent implements OnInit {

    filters: Filter[] = [
        {
            name: "orderBy",
            text: "Sorteer op",
            options: [
                {
                    value: "time",
                    text: "Uplood datum"
                },
                {
                    value: "score",
                    text: "Waardering"
                }
            ]
        }
    ];

    foundPosts: Post[] = [];

    canLoadMore = true;
    noResultsText = "";

    constructor(
        @Host() public profile: ProfileComponent,
        private posts: PostsService,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle("Uploods van " + this.profile.user.username);
    }

    onSearch(search: Search) {
        this.posts.getPostsOfUser(
            this.profile.user.id, search.query, search.page, 
            this.filters[0].selectedOption.value as string
        ).subscribe(posts => {

            if (search.page == 0) {
                this.foundPosts = posts;
            } else {
                this.foundPosts = this.foundPosts.concat(posts);
            }

            this.noResultsText = this.foundPosts.length == 0 ? "Geen uploods gevonden :-|" : "";
            this.canLoadMore = posts.length > 6;

        });
    }

}
