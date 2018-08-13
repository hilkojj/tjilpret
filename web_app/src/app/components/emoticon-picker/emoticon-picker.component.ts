import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';

@Component({
    selector: 'app-emoticon-picker',
    templateUrl: './emoticon-picker.component.html',
    styleUrls: ['./emoticon-picker.component.scss']
})
export class EmoticonPickerComponent implements OnInit {

    @Input() input: HTMLTextAreaElement;

    showPicker = false;

    private thisElement: Element;

    constructor(elRef: ElementRef) {
        this.thisElement = elRef.nativeElement;
    }

    ngOnInit() {
    }

    insert(name: string) {

        var value = this.input.value;
        var selectionStart = this.input.selectionStart;

        this.input.value = value.substr(0, selectionStart) + " :" + name + ": " + value.substr(selectionStart, value.length - selectionStart);

        this.input.focus();
        this.input.selectionStart = this.input.selectionEnd = selectionStart + name.length + 4;
    }

    @HostListener('window:mouseup', ['$event'])
    click(event) {
        var path = event.path;
        for (var element of path) if (element == this.thisElement) return;

        // click happened outside of this component:
        this.showPicker = false;
    }

    private prevWindowWidth;
    private prevLeft;

    getPickerLeft(picker: Element): string {

        if (this.prevWindowWidth == window.innerWidth) return this.prevLeft;

        var r = picker.getBoundingClientRect();

        this.prevWindowWidth = window.innerWidth;
        this.prevLeft = Math.min(0, window.innerWidth - (r.left + r.width) - 8) + "px";
        return this.prevLeft;
    }

}
