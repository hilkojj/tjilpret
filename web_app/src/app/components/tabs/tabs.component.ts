import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

export class Tab {

    constructor(
        public title: string,
        public icon: string,
        public routerLink: any[] | string,
        public activeClassExact: boolean,
        public number?: number,
        public badgeNumber?: () => number
    ) { }

}

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

    @Input() tabs: Tab[];
    @Input() hideLabelOnMed: boolean;
    @Input() wavesEffect = true;
    @Input() replaceUrl = false;

    constructor(
        private theme: ThemeService
    ) { }

    ngOnInit() {
    }

    get numbersInTabs() {
        for (var i in this.tabs) if (this.tabs[i].number != null) return true;
        return false;
    }

}
