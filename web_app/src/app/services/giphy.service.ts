import { Injectable } from '@angular/core';
import { ModalService } from './modal.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

export interface Giphy {

    type: string;
    id: string;
    images: any;

}

export interface GiphyResponse {

    data: Giphy[];

    pagination: {
        last: boolean;
        total_count: number;
        count: number;
        offset: number;
    };

}

const GIPHY_API_KEY = "dc6zaTOxFJmzC";
const GIPHY_API_URL = "http://api.giphy.com/v1/";
const GIFS_PER_PAGE = 25;

@Injectable({
    providedIn: 'root'
})
export class GiphyService {

    resolve;

    constructor(
        private modals: ModalService,
        private http: HttpClient
    ) { }

    openGiphySearch(): Promise<Giphy> {

        this.modals.showModal("giphySearch");

        return new Promise<Giphy>(resolve => this.resolve = resolve);
    }

    search(query: string, page: number): Observable<GiphyResponse> {
        return this.http.get<GiphyResponse>(GIPHY_API_URL + "gifs/search", {
            params: {
                api_key: GIPHY_API_KEY,
                q: query,
                limit: GIFS_PER_PAGE + "",
                offset: (GIFS_PER_PAGE * page) + "",
                lang: "nl"
            }
        }).map(res => {
            console.log(res);
            res.pagination.last = res.pagination.count < GIFS_PER_PAGE;
            return res;
        });
    }

    giphyById(id: string): Observable<Giphy> {
        return this.http.get<Giphy>(GIPHY_API_URL + "gifs/" + id, {
            params: {
                api_key: GIPHY_API_KEY
            }
        }).map(res => res["data"]);
    }

}
