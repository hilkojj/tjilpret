import { Injectable } from '@angular/core';
import { ModalService } from './modal.service';

export class ImageCropperOptions {
    file: File;
    title: string;
    viewPortWidth: number; viewPortHeight: number;
    circle: boolean;
    boundaryHeight: number;
    resultWidth: number; resultHeight: number
}

@Injectable({
    providedIn: 'root'
})
export class ImageCropperService {

    options: ImageCropperOptions;
    resolve;

    constructor(
        private modals: ModalService
    ) { }

    cropImage(options: ImageCropperOptions): Promise<File> {

        this.options = options;

        if (options.file.type == "image/gif") {
            this.modals.hideModal();
            return new Promise(resolve => resolve(options.file));
        }

        this.modals.showModal("imageCropper");

        return new Promise(resolve => this.resolve = resolve);
    }

}
