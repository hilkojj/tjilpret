import { Component, OnInit, Input, Renderer, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../services/modal.service';

export interface Search {
    query: string;
    page: number;
}

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    @Input() placeholder = "Zoeken...";
    @Input() filtersModalName = "" + (Math.random() * 10000 | 0);
    @Input() canLoadMore = true;
    @Input() noResultsText = "";

    @Output("onSearch") emitter = new EventEmitter<Search>();

    query = "";

    private submittedQuery = "";
    private page = -1;

    constructor(
        public modals: ModalService,

        private renderer: Renderer
    ) { }

    ngOnInit() {
    }

    search(event?) {

        if (event) this.renderer.invokeElementMethod(event.target, 'blur');

        this.page = 0;
        this.submittedQuery = this.query;
        this.emitter.emit({
            query: this.submittedQuery,
            page: 0
        });

    }

    loadMore() {
        this.emitter.emit({
            query: this.submittedQuery,
            page: ++this.page
        });
    }

}
