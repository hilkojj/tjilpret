import { Directive, ElementRef, Output, EventEmitter, HostListener, AfterViewChecked, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
    selector: '[inViewport]'
})
export class InViewportDirective implements OnInit, OnDestroy {

    private inViewport = false;

    @Output() ifInViewport = new EventEmitter();
    @Output() ifNotInViewport = new EventEmitter();

    @Input() scrollParent: Element;

    scrollListener = () => {
        this.check();
    };

    constructor(
        private el: ElementRef
    ) { }

    ngOnInit() {
        this.scrollParent.addEventListener("scroll", this.scrollListener);
    }

    ngOnDestroy() {
        this.scrollParent.removeEventListener("scroll", this.scrollListener);
    }

    check() {

        var prevInViewport = this.inViewport;

        var rect = this.el.nativeElement.getBoundingClientRect();

        this.inViewport = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

        if (prevInViewport != this.inViewport)
            (this.inViewport ? this.ifInViewport : this.ifNotInViewport).emit();

    }

}
