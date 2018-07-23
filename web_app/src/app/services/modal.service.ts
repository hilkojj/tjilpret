import { Injectable } from '@angular/core';
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
            if (!location.hash.startsWith("#"))
                this.hideModal();
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

        if (location.hash == "")
            location.hash = modal.hash;
        else
            history.replaceState(null, null, document.location.pathname + `#${modal.hash}`);

        document.body.classList.add("modal-open");
    }

    hideModal() {

        var modal = this.activeModalComponent;

        if (modal == undefined)
            return;

        modal.active = false;
        this.activeModal = null;
        setTimeout(() => {
            if (this.activeModal == null) document.body.classList.remove("modal-open")
        }, 200);
    }

}
