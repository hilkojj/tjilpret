import { Component, OnInit, Renderer, HostListener } from '@angular/core';
import { GiphyService, Giphy } from '../../services/giphy.service';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-giphy-search',
    templateUrl: './giphy-search.component.html',
    styleUrls: ['./giphy-search.component.scss']
})
export class GiphySearchComponent implements OnInit {

    categories: {
        gifUrl: string,
        title: string,
        query: string
    }[] = [

        {
            gifUrl: "http://media2.giphy.com/media/lKGT2KiIV50DC/giphy-downsized.gif",
            title: "Bert en ernie",
            query: "bert ernie"
        },
        {
            gifUrl: "http://media2.giphy.com/media/ql4LidslabKpi/giphy-downsized.gif",
            title: "Geïrriteert",
            query: "annoyed irritated"
        },
        {
            gifUrl: "https://media0.giphy.com/media/l46CkATpdyLwLI7vi/giphy-downsized.gif",
            title: "Verheugd",
            query: "pleased excited"
        },
        {
            gifUrl: "https://media0.giphy.com/media/33zX3zllJBGY8/giphy-downsized.gif",
            title: "Dierlijk",
            query: "animals"
        },
        {
            gifUrl: "https://media3.giphy.com/media/nFjDu1LjEADh6/giphy-downsized.gif",
            title: "Mee eens",
            query: "agree"
        },
        {
            gifUrl: "http://media2.giphy.com/media/3o7TKshA1b3tp0Y20U/giphy-downsized.gif",
            title: "Geschokt",
            query: "shocked"
        },
        {
            gifUrl: "https://media3.giphy.com/media/QBC5foQmcOkdq/giphy.gif",
            title: "Applaus",
            query: "applause"
        },
        {
            gifUrl: "https://media0.giphy.com/media/7dSNGCyJkCM5q/giphy-downsized.gif",
            title: "Tering schattige hodnjes",
            query: "cute dog"
        }
        
        
    ];

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
        
        this.searchByQuery(this.query);
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
            this.giphy.search(this.submittedQuery, ++this.page).subscribe(res => {
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

    searchByQuery(query: string) {
        location.hash = this.searchHash;

        this.giphies = null;
        this.last = false;
        this.page = 0;
        this.submittedQuery = query;
        this.showCategories = false;
        this.giphy.search(query, 0).subscribe(res => {
            this.giphies = [res.data];
            this.last = res.pagination.last;
            this.count = res.pagination.total_count;
        });
    }

}
