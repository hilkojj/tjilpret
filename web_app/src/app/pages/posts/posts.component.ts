import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/post';
import { Tab } from '../../components/tabs/tabs.component';
import { ModalService } from '../../services/modal.service';

interface PostsTab extends Tab {
    numberPrefix: string;
    postsResolver: () => Observable<Post[]>,
    posts?: Post[];
}

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
    
    tabs: PostsTab[] = [
        {
            routerLink: "../top",
            title: "Toppie uploods",
            numberPrefix: "Toppie",
            icon: "trending_up",
            activeClassExact: true,
            postsResolver: () => this.service.searchPosts("", "any", "score", true)
        },

        {
            routerLink: "../niew",
            title: "Niwe uploods",
            numberPrefix: "Nieuw",
            icon: "new_releases",
            activeClassExact: true,
            postsResolver: () => this.service.searchPosts("", "any", "time", true)
        },

        {
            routerLink: "../niewsberichten",
            title: "Nieuwsberichten",
            numberPrefix: "Breaking news",
            icon: "import_contacts",
            activeClassExact: true,
            postsResolver: () => this.service.searchPosts("", "any", "time", true, 3)
        },

        {
            routerLink: "../meest-bekeken",
            title: "Meest bekeken",
            numberPrefix: "Meest bekeken",
            icon: "remove_red_eye",
            activeClassExact: true,
            postsResolver: () => this.service.searchPosts("", "any", "views", true)
        },

        {
            routerLink: "../pretbedervers",
            title: "Pretbedervers",
            numberPrefix: "Pretbedervend",
            icon: "trending_down",
            activeClassExact: true,
            postsResolver: () => this.service.searchPosts("", "any", "score", false)
        }
    ];
    postsLoaded = false;
    currentTabI = 0;
    featuredPostI = 0;
    showCarouselPost = false;

    constructor(
        public service: PostsService,
        public modals: ModalService,

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
                this.startCarouselInterval();
            }, 20);
        });

        this.setTab(this.route.snapshot.paramMap.get("tab"));
        this.route.paramMap.map(paramMap => paramMap.get("tab")).subscribe(tab => {
            this.setTab(tab);
        });

    }

    ngOnDestroy(): void {
        this.stopCarouselInterval();
    }

    private setTab(tabName: string) {
        var newTabI = 0;
        for (let tab of this.tabs) {
            if ("../" + tabName == tab.routerLink) {

                if (this.currentTabI != newTabI) {
                    this.featuredPostI = 0;
                    this.stopCarouselInterval();
                    this.startCarouselInterval();
                }

                this.currentTabI = newTabI;
                return;

            } else newTabI++;
        }
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

    startCarouselIntervalTimeout;
    carouselInterval;

    startCarouselIntervalAfterTimeout() {
        this.startCarouselIntervalTimeout = setTimeout(() => this.startCarouselInterval(), 2000);
    }

    startCarouselInterval() {
        if (this.carouselInterval == null)
            this.carouselInterval = setInterval(() => this.nextFeaturedPost(), 4000);
    }

    stopCarouselInterval() {
        clearInterval(this.carouselInterval);
        clearTimeout(this.startCarouselIntervalTimeout);
        this.carouselInterval = null;
    }

}
