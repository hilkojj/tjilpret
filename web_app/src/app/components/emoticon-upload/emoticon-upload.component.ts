import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-emoticon-upload',
    templateUrl: './emoticon-upload.component.html',
    styleUrls: ['./emoticon-upload.component.scss']
})
export class EmoticonUploadComponent implements OnInit {

    file: File;

    constructor(
        private modals: ModalService
    ) { }

    ngOnInit() {
    }

    fileChosen(file: File) {
        this.file = file;
        this.modals.showModal("newEmoticon");
    }

}
