import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { EmoticonsService } from '../../services/emoticons.service';

@Component({
    selector: 'app-emoticon-upload',
    templateUrl: './emoticon-upload.component.html',
    styleUrls: ['./emoticon-upload.component.scss']
})
export class EmoticonUploadComponent implements OnInit {

    name = "";
    categoryId = -1;
    file: File;
    previewSrc: string;
    error: string;
    nameError = false;

    constructor(
        public service: EmoticonsService,

        private modals: ModalService
    ) { }

    ngOnInit() {
    }
    
    reset() {
        this.file = null;
        this.previewSrc = null;
        this.error = null;
        this.nameError = false;
    }

    fileChosen(file: File) {
        this.reset();

        this.file = file;
        this.modals.showModal("newEmoticon");

        var fr = new FileReader();
        fr.onload = () => {
            this.previewSrc = fr.result;

            var img = new Image();
            img.onload = () => {
                if (img.width < 100 || img.height < 100)
                    this.error = "Platje mot minimaal 100x100 pixels zijn";
                else if (img.width > 600 || img.height > 600)
                    this.error = "Platje mag maximaal 600x600 pixels zijn";
                else if (file.size > 1000000)
                    this.error = "Platje mag nit groter dan 1MB";
                
                this.checkName();
            }
            img.src = fr.result;
        }
        fr.readAsDataURL(file);
    }

    checkName() {
        if (this.error && !this.nameError) return;

        if (/\W/.test(this.name)) {
            this.error = "Naam mag alleen letters, cijfers en lage streepjes bevatten."
            this.nameError = true;
        } else {
            this.error = "";
            this.nameError = false;
        }
    }

    upload() {
        this.service.upload(this.name, this.categoryId, this.file).subscribe(success => {
            if (success) {
                this.modals.hideModal();
                this.reset();
                this.service.update();
            }
        });
    }

}
