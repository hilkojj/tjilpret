import { Injectable } from '@angular/core';
import { ModalService } from './modal.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

export interface Giphy {

    type: string;
    id: string;
    
}

export interface GiphyResponse {
    
    data: Giphy[];

    paginatation: {
        total_count: number;
        count: number;
        offset: number;
    };

}

const GIPHY_API_KEY = "dc6zaTOxFJmzC";
const GIPHY_API_URL = "http://api.giphy.com/v1/";

@Injectable({
    providedIn: 'root'
})
export class GiphyService {

    resolve;

    constructor(
        private modals: ModalService,
        private http: HttpClient
    ) { }

    getGiphy(): Promise<string> {

        this.modals.showModal("giphySearch");

        return new Promise<string>(resolve => this.resolve = resolve);
    }

    search(query): Observable<GiphyResponse> {
        return this.http.get<GiphyResponse>(GIPHY_API_URL + "gifs/search", {
            params: {
                api_key: GIPHY_API_KEY,
                q: query
            }
        });
    }

}
