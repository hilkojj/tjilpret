import { Component, OnInit, Renderer, HostListener } from '@angular/core';
import { GiphyService, GiphyResponse } from '../../services/giphy.service';

@Component({
    selector: 'app-giphy-search',
    templateUrl: './giphy-search.component.html',
    styleUrls: ['./giphy-search.component.scss']
})
export class GiphySearchComponent implements OnInit {

    query = "";

    showCategories = true;
    searchHash = "gif-zoeke";

    searchResults: GiphyResponse;

    constructor(
        private renderer: Renderer,
        private giphy: GiphyService
    ) { }

    ngOnInit() {
    }

    search(event?) {
        if (event) this.renderer.invokeElementMethod(event.target, 'blur');
        location.hash = this.searchHash;

        this.showCategories = false;
        this.giphy.search(this.query).subscribe(res => this.searchResults = res);
    }

    @HostListener('window:hashchange', ['$event'])
    hashChange() {
        if (location.hash != "#" + this.searchHash) {
            this.showCategories = true;
            this.searchResults = null;
        }
    }

}
