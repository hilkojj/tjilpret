import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ImageCropperService } from '../../services/image-cropper.service';
import { EditProfileService } from '../../services/edit-profile.service';

@Component({
    selector: 'app-edit-profile-modal',
    templateUrl: './edit-profile-modal.component.html',
    styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit {

    options: {
        icon: string,
        color: string,
        title: string,
        desc: string,
        upload: string,
        fileSelected: (file: File) => void,
        click: () => void
    }[] = [
            {
                icon: "portrait",
                color: "indigo",
                title: "Profilfoto",
                desc: "Uplood een profilfoto (GIFjes toegestaan!)",
                upload: "image/*",
                fileSelected: file => this.imageCropper.cropImage(
                    {
                        file: file,
                        title: "Profilfoto bysnyden",
                        viewPortWidth: 160, viewPortHeight: 160,
                        circle: true,
                        boundaryHeight: 340,
                        resultWidth: 800, resultHeight: 800
                    }
                ).then(cropped => {

                    this.editProfile.uploadProfilePic(cropped);

                }),
                click: null
            },

            {
                icon: "panorama",
                color: "red accent-3",
                title: "Banner",
                desc: "Uplood een banner voor boven je profiel",
                upload: "image/*",
                fileSelected: file => this.imageCropper.cropImage(
                    {
                        file: file,
                        title: "Banner bijsneiden",
                        viewPortWidth: 400, viewPortHeight: 160,
                        circle: false,
                        boundaryHeight: 340,
                        resultWidth: 1600, resultHeight: 640
                    }
                ).then(cropped => {

                    this.editProfile.uploadBanner(cropped);

                }),
                click: null
            },

            {
                icon: "color_lens",
                color: "fav-bg",
                title: "Lieflingskleur",
                desc: "Kies jou persoonlijke lieflingskleur, die tevens het thema aanpast.",
                click: () => this.modals.showModal("editFavColor"),
                upload: null,
                fileSelected: null
            },

            {
                icon: "edit",
                color: "teal",
                title: "Status",
                desc: "Vertel je levensverhaal. Of andere onzin",
                click: () => this.modals.showModal("editBio"),
                upload: null,
                fileSelected: null
            },

            {
                icon: "volume_up",
                color: "green accent-3",
                title: "Geluidje",
                desc: "Uplood een ingesproken bericht/muziekje dat zich afspeelt op jou profiel, of als iemand zn muis op je pf houd. (.mp3 of .wav)",
                upload: "audio/mpeg, audio/wav",
                fileSelected: file => { 
                    this.editProfile.uploadSoundFragment(file); 
                    history.back(); 
                },
                click: null
            }

        ];

    constructor(
        private modals: ModalService,
        private imageCropper: ImageCropperService,
        private editProfile: EditProfileService
    ) { }

    ngOnInit() {
    }

}
