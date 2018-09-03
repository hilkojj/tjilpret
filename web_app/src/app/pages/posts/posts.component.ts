import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post';

interface PostsTab {
    path: string;
    name: string;
    numberPrefix: string;
    icon: string;
    postsResolver: () => Observable<Post[]>,
    posts?: Post[];
}

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

    tabs: PostsTab[] = [
        {
            path: "top",
            name: "Toppie uploods",
            numberPrefix: "Toppie",
            icon: "trending_up",
            postsResolver: () => this.service.searchPosts("", "any", "score", true)
        },

        {
            path: "niew",
            name: "Niwe uploods",
            numberPrefix: "Nieuw",
            icon: "new_releases",
            postsResolver: () => this.service.searchPosts("", "any", "time", true)
        },

        {
            path: "niewsberichten",
            name: "Nieuwsberichten",
            numberPrefix: "Breaking news",
            icon: "import_contacts",
            postsResolver: () => this.service.searchPosts("", "any", "time", true, 3)
        },

        {
            path: "meest-bekeken",
            name: "Meest bekeken",
            numberPrefix: "Meest bekeken",
            icon: "remove_red_eye",
            postsResolver: () => this.service.searchPosts("", "any", "views", true)
        },

        {
            path: "pretbedervers",
            name: "Pretbedervers",
            numberPrefix: "Pretbedervend",
            icon: "trending_down",
            postsResolver: () => this.service.searchPosts("", "any", "score", false)
        }
    ];
    postsLoaded = false;
    currentTabI = 0;
    featuredPostI = 0;
    showCarouselPost = false;

    constructor(
        public service: PostsService,

        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        forkJoin(
            this.tabs.map(tab => tab.postsResolver())
        ).subscribe(allPosts => {
            for (var i in allPosts)
                this.tabs[i].posts = allPosts[i];

            this.postsLoaded = true;
            setTimeout(() => {
                this.showCarouselPost = true;
            }, 20);
        });
    }

    get tab(): PostsTab {
        return this.tabs[this.currentTabI]
    }

    get featuredPost(): Post {

        return this.tab.posts[this.featuredPostI];
    }

    get shortFeaturedPostDescription(): string {

        var p = this.featuredPost;

        if (p.description.length > 100) return p.description.slice(0, 90) + "...";
        return p.description;
    }

    prevFeaturedPost() {

        this.showCarouselPost = false;

        setTimeout(() => {
            this.featuredPostI--;
            if (this.featuredPostI < 0) this.featuredPostI = Math.min(7, this.tab.posts.length - 1);
            this.showCarouselPost = true;
        }, 400);

    }

    nextFeaturedPost() {
        
        this.showCarouselPost = false;

        setTimeout(() => {
            this.featuredPostI++;
            if (this.featuredPostI > Math.min(7, this.tab.posts.length - 1)) this.featuredPostI = 0;
            this.showCarouselPost = true;
        }, 400);
    }

}
