import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { ColorClass } from '../models/colors';
import { API_URL } from '../constants';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    get autoPlaySoundFragment(): boolean {
        return localStorage.getItem("autoPlaySoundFragment") == "true";
    }

    set autoPlaySoundFragment(value: boolean) {
        localStorage.setItem("autoPlaySoundFragment", value + "");
    }

    constructor(
        private http: HttpClient
    ) { }

    getColorClassByID(id: number): Observable<ColorClass> {
        return this.http.post<ColorClass>(API_URL + "colorInfo", {
            colorClassID: id
        });
    }

    getColorClassByUserID(id: number): Observable<ColorClass> {
        return this.http.post<ColorClass>(API_URL + "colorInfoByUserID", {
            id
        });
    }

}
