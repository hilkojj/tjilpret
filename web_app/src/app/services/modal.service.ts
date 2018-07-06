import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    modals: { [name: string]: ModalComponent } = {};
    activeModal: string;

    constructor(
    ) {
        window.addEventListener('hashchange', () => {
            if (
                this.activeModalComponent != undefined
                && location.hash != `#${this.activeModalComponent.hash}`
            )
                this.hideModal()
        });
        location.hash = "";
    }

    get activeModalComponent(): ModalComponent {
        return this.modals[this.activeModal];
    }

    showModal(name: string) {

        this.hideModal();
        var modal = this.modals[name];

        if (modal == undefined) {
            console.log(`modal '${name}' not found`);
            return;
        }

        this.activeModal = name;
        modal.active = true
        location.hash = modal.hash;
        document.body.classList.add("modal-open");
    }

    hideModal() {

        var modal = this.activeModalComponent;

        if (modal == undefined)
            return;

        modal.active = false;
        this.activeModal = null;
        setTimeout(() => document.body.classList.remove("modal-open"), 200);
    }

}
