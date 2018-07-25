import { Component, OnInit, Host, ViewChild, ElementRef } from '@angular/core';
import { ImageCropperService } from '../../services/image-cropper.service';

@Component({
    selector: 'app-image-cropper-modal',
    templateUrl: './image-cropper-modal.component.html',
    styleUrls: ['./image-cropper-modal.component.scss']
})
export class ImageCropperModalComponent implements OnInit {

    @ViewChild('iframe') iframe: ElementRef;
    croppie;
    loading = true;

    constructor(
        public service: ImageCropperService
    ) { }

    ngOnInit() {
    }

    initCroppie() {

        var doc = this.iframe.nativeElement.contentDocument;
        var win = this.iframe.nativeElement.contentWindow;

        var o = this.service.options;

        this.croppie = new win.Croppie(doc.getElementById("croppie"), {
            viewport: {
                width: o.viewPortWidth,
                height: o.viewPortHeight,
                type: o.circle ? "circle" : "square"
            },
            boundary: {
                height: o.boundaryHeight
            },
            enableOrientation: true
        });

        var reader = new FileReader();
        reader.onload = e => {

            var result = e.target['result'];
            this.croppie.bind({
                url: result,
                orientation: 1
            });
            this.loading = false;
        }

        reader.readAsDataURL(o.file);
    }

    save() {

        var o = this.service.options;
        this.loading = true;

        this.croppie.result({
            type: "blob",
            size: {
                width: o.resultWidth,
                height: o.resultHeight
            },
            circle: false
        }).then((blob: File) => {
            this.service.resolve(blob);
            history.back();
        });
    }

}
