import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    animations: [
        trigger(
            "fade", [
                transition(":enter", [
                    style({ opacity: 0 }),
                    animate(".1s", style({ opacity: 1 }))
                ]),
                transition(":leave", [
                    style({ opacity: 1 }),
                    animate(".1s", style({ opacity: 0 }))
                ])
            ]
        ),

        trigger(
            "modalAnim", [
                state("default, left, right, bottom", style({
                    opacity: 1,
                    transform: "scaleX(1) translate(0, 0)"
                })),
                transition("* => *", animate(".6s cubic-bezier(0.19, 1, 0.22, 1)"))
            ]
        )
    ]
})
export class ModalComponent implements OnInit {

    @Input() name: string;
    @Input() hash: string;
    @Input() type: string = "default";
    @Input() width: string = "600px";

    active = false;

    constructor(
        private modals: ModalService,
        private router: Router
    ) { }

    ngOnInit() {

        this.modals.modals[this.name] = this;

    }

    close() {
        history.back();
    }

    navigate(url: string) {
        this.modals.hideModal();
        this.router.navigateByUrl(url, {
            replaceUrl: true
        });
    }

}
