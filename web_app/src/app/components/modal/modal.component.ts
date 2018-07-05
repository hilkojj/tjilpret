import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    animations: [
        trigger(
            "fade", [
                transition(":enter", [
                    style({ opacity: 0 }),
                    animate(".2s ease-out", style({ opacity: 1 }))
                ]),
                transition(":leave", [
                    style({ opacity: 1 }),
                    animate(".2s ease-in", style({ opacity: 0 }))
                ])
            ]
        )
    ]
})
export class ModalComponent implements OnInit {

    @Input() name: string;
    @Input() hash: string;
    @Input() closable: boolean = true;
    
    active = false;

    constructor(
        private modals: ModalService
    ) { }

    ngOnInit() {

        this.modals.modals[this.name] = this;

    }

    close() {
        history.back();
    }

}
