import { Directive, OnChanges, ElementRef, Input } from '@angular/core';
import { Post } from '../models/post';
import { PostsService } from '../services/posts.service';

@Directive({
    selector: '[postLink]'
})
export class PostLinkDirective implements OnChanges {

    @Input() postLink: Post;

    initialized = false;

    constructor(
        private el: ElementRef,
        private service: PostsService
    ) { }

    ngOnChanges() {
        if (this.initialized || !this.postLink) return;
        var elem = this.el.nativeElement;
        elem.href = "/uplood/" + this.postLink.id;
        elem.onclick = () => {
            this.service.showPost(this.postLink);
            return false;
        }
        this.initialized = true;
    }
}
