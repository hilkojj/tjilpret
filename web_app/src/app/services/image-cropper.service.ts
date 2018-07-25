import { Injectable } from '@angular/core';
import { ModalService } from './modal.service';
import { UtilsService } from './utils.service';
import { Ng2PicaService } from '../../../node_modules/ng2-pica';

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
        private modals: ModalService,
        private utils: UtilsService,
        private pica: Ng2PicaService
    ) { }

    cropImage(options: ImageCropperOptions): Promise<File> {

        this.options = options;

        if (options.file.type == "image/gif") {
            this.modals.hideModal();
            return new Promise(resolve => resolve(options.file));
        }

        
        if (this.utils.mobile) {
            // resize large images on mobile to increase peformance

            this.pica.resize([this.options.file], 2000, 2000, true).subscribe(resized => {
                console.log("Image resized with pica");
                this.options.file = resized;
                this.modals.showModal("imageCropper");
            })

        } else this.modals.showModal("imageCropper");

        return new Promise(resolve => this.resolve = resolve);
    }

}
