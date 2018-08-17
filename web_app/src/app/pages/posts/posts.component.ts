import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { MaterializeAction } from '../../../../node_modules/angular2-materialize';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {

    carouselActions = new EventEmitter<string | MaterializeAction>();
    nextCarouselItemInterval;
    
    constructor() { }

    ngOnInit() {

        this.startCarouselInterval();
    }
    
    startCarouselInterval() {

        this.nextCarouselItemInterval = setInterval(() => {
    
            this.carouselActions.emit({
                action: "carousel",
                params: ["next"]
            });

        }, 3000);
    }

    stopCarouselInterval() {

        clearInterval(this.nextCarouselItemInterval);
    }

    ngOnDestroy() {

        this.stopCarouselInterval();
        
    }

}
