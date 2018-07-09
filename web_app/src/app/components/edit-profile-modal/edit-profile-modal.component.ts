import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-edit-profile-modal',
    templateUrl: './edit-profile-modal.component.html',
    styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit {

    options = [
        {
            icon: "portrait",
            color: "indigo",
            title: "Profilfoto",
            desc: "Uplood een profilfoto (GIFjes toegestaan!)",
            click: () => console.log("poep")
        },

        {
            icon: "panorama",
            color: "red accent-3",
            title: "Banner",
            desc: "Uplood een banner voor boven je profiel",
            click: () => console.log("poep")
        },
        
        {
            icon: "color_lens",
            color: "fav-bg",
            title: "Lieflingskleur",
            desc: "Kies jou persoonlijke lieflingskleur, die tevens het thema aanpast.",
            click: () => this.modals.showModal("editFavColor")
        },

        {
            icon: "edit",
            color: "teal",
            title: "Status",
            desc: "Vertel je levensverhaal. Of andere onzin",
            click: () => this.modals.showModal("editBio")
        },

        {
            icon: "volume_up",
            color: "green accent-3",
            title: "Geluidje",
            desc: "Uplood een ingesproken bericht/muziekje dat zich afspeelt op jou profiel, of als iemand zn muis op je pf houd.",
            click: () => console.log("poep")
        }

    ];

    constructor(
        private modals: ModalService
    ) { }

    ngOnInit() {
    }

}
