import { Component, Input, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { EmoticonsService } from '../../services/emoticons.service';
import { EmoticonCategory } from '../../models/emoticons';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'app-emoticon-picker',
    templateUrl: './emoticon-picker.component.html',
    styleUrls: ['./emoticon-picker.component.scss']
})
export class EmoticonPickerComponent {

    @Input() input: HTMLTextAreaElement;
    @Output() inputChange = new EventEmitter<string>();

    showPicker = false;
    emoticons: EmoticonCategory[];
    searchQuery = "";
    activeCatId = 0;

    private thisElement: Element;

    constructor(
        elRef: ElementRef,
        public service: EmoticonsService,

        private utils: UtilsService

    ) {
        this.thisElement = elRef.nativeElement;
    }

    toggle() {
        this.showPicker = !this.showPicker;

        if (!this.showPicker) return;

        this.emoticons = this.service.emoticons;
        this.activeCatId = 0 in this.emoticons ? this.emoticons[0].id : 0;
    }

    insert(name: string) {

        var value = this.input.value;
        var selectionStart = this.input.selectionStart;

        var insert = ":" + name + ": "

        if (this.input.maxLength && value.length + insert.length > this.input.maxLength)
            return this.utils.errorToast("Emoticon past niet meer", 2000);

        this.input.value = value.substr(0, selectionStart) + insert + value.substr(selectionStart, value.length - selectionStart);

        this.input.focus();
        this.input.selectionStart = this.input.selectionEnd = selectionStart + insert.length;

        this.inputChange.emit(this.input.value);
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

    private weirdCorrection = 74;

    showCategory(id: number) {
        var target = this.getCatDiv(id);
        target.parentElement.scrollTop = target.offsetTop - this.weirdCorrection;
    }

    onScroll(scrollElement: Element) {

        for (var cat of this.emoticons) {

            var div = this.getCatDiv(cat.id);

            if (scrollElement.scrollTop - div.offsetTop + this.weirdCorrection < -3) break;
            
            this.activeCatId = cat.id;
        }
    }

    private getCatDiv(id: number) {
        return document.getElementById('emoticon-picker-cat-' + id);
    }

}
