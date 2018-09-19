import { Directive, ElementRef, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
    selector: '[inViewport]'
})
export class InViewportDirective implements OnInit, OnDestroy {

    private inViewport = false;
    private interval;

    @Output() ifInViewport = new EventEmitter();
    @Output() ifNotInViewport = new EventEmitter();

    @Input() intervalTimeout = 1000;

    constructor(
        private el: ElementRef
    ) { }

    ngOnInit() {

        this.interval = setInterval(() => this.check(), this.intervalTimeout);
        this.check();
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    check() {
        var prevInViewport = this.inViewport;

        var rect = this.el.nativeElement.getBoundingClientRect();

        var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

        this.inViewport = this.el.nativeElement.offsetParent != null &&
            (
                (rect.top >= 0 && rect.top <= windowHeight)
                ||
                (rect.bottom >= 0 && rect.bottom <= windowHeight)
            )
            &&
            (
                (rect.left >= 0 && rect.left <= windowWidth)
                ||
                (rect.right >= 0 && rect.right <= windowWidth)
            )

        if (prevInViewport != this.inViewport)
            (this.inViewport ? this.ifInViewport : this.ifNotInViewport).emit();

    }

}
