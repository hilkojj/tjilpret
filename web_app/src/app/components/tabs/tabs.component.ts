import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

export class Tab {

    constructor(
        public title: string,
        public icon: string,
        public routerLink: any[] | string
    ) {}

}

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

    @Input() tabs: Tab[];
    @Input() hideLabelOnMed: boolean;

    constructor(
        private theme: ThemeService
    ) { }

    ngOnInit() {
    }

}
