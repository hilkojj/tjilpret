import { Component, Input, HostListener, Output, EventEmitter, OnChanges } from '@angular/core';
import { HSL } from '../../models/colors';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss']
})
export class ColorSliderComponent implements OnChanges {

    @Input() type: string = "hue";
    @Input() hsl: HSL;
    @Input() minL = 0;
    @Input() maxL = 100;

    @Output("hslChange") emitter = new EventEmitter<HSL>();

    mouseDown = false;
    value = .5;
    perc = 50;

    constructor(
        private escaper: DomSanitizer
    ) { }

    ngOnChanges() {
        switch (this.type) {
            case "hue":
                this.value = this.hsl.h / 360;
                break;

            case "sat":
                this.value = this.hsl.s / 100;
                break;

            case "lig":
                this.value = (this.hsl.l - this.minL) / (this.maxL - this.minL);
                break;
        }
        this.perc = (this.value * 1000 | 0) / 10;
    }

    mouseMove(e) {
        if (!this.mouseDown) return;

        var clientX = e.clientX;
        if (clientX == undefined)
            clientX = e.touches[0].clientX;

        var rect = e.target.getBoundingClientRect();
        var x = clientX - rect.left;
        var val = x / e.target.offsetWidth;
        this.value = Math.max(0, Math.min(1, val));
        this.perc = (this.value * 1000 | 0) / 10;

        switch (this.type) {
            case "hue":
                this.hsl.h = this.value * 360 | 0;
                break;

            case "sat":
                this.hsl.s = this.value * 100;
                break;

            case "lig":
                this.hsl.l = this.value * (this.maxL - this.minL) + (this.minL | 0);
                break;
        }

        this.emitter.emit(this.hsl);

        e.preventDefault();
    }

    @HostListener('window:mouseup', ['$event'])
    mouseUp() {
        if (this.mouseDown) this.mouseDown = false;
    }

    get background() {
        return this.escaper.bypassSecurityTrustStyle(this.type == 'hue' ? 'inherit' : (
            this.type == 'sat' ? `linear-gradient(
                    to right, hsl(${this.hsl.h}, 0%, 50%), hsl(${this.hsl.h}, 100%, 50%)
                )`
                : `linear-gradient(
                    to right, 
                    hsl(${this.hsl.h}, ${this.hsl.s}%, ${this.minL}%),

                    hsl(${this.hsl.h}, ${this.hsl.s}%, ${(this.maxL - this.minL) / 2 + (this.minL | 0)}%),

                    hsl(${this.hsl.h}, ${this.hsl.s}%, ${this.maxL}%)
                )`
        ));
    }

}
