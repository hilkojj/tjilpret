import { Component, OnInit, Renderer, HostListener } from '@angular/core';
import { GiphyService, Giphy } from '../../services/giphy.service';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-giphy-search',
    templateUrl: './giphy-search.component.html',
    styleUrls: ['./giphy-search.component.scss']
})
export class GiphySearchComponent implements OnInit {

    query = "";
    giphies: Giphy[][];
    showCategories = true;
    last = false;
    count = 0;

    private searchHash = "gif-zoeke";
    private page = 0;
    private submittedQuery = "";

    constructor(
        private renderer: Renderer,
        private giphy: GiphyService
    ) { }

    ngOnInit() {
    }

    search(event?) {
        if (event) this.renderer.invokeElementMethod(event.target, 'blur');
        location.hash = this.searchHash;

        this.giphies = null;
        this.last = false;
        this.page = 0;
        this.submittedQuery = this.query;
        this.showCategories = false;
        this.giphy.search(this.query, 0).subscribe(res => {
            this.giphies = [res.data];
            this.last = res.pagination.last;
            this.count = res.pagination.total_count;
        });
    }

    @HostListener('window:hashchange', ['$event'])
    hashChange() {
        if (location.hash != "#" + this.searchHash) {
            this.showCategories = true;
            this.giphies = null;
        }
    }

    loadMore() {

        if (this.giphies == null) return;

        if (!this.last)
            this.giphy.search(this.query, ++this.page).subscribe(res => {
                this.giphies[this.page] = res.data;
                this.last = res.pagination.last;
            });
    }

    choose(giphy: Giphy) {
        this.giphy.resolve(giphy);
        this.showCategories = true;
        this.giphies = null;
        history.go(-2);
    }

}
