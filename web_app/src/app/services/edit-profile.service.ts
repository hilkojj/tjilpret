import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs';
import { ColorClass, RGB } from '../models/colors';

@Injectable({
    providedIn: 'root'
})
export class EditProfileService {

    constructor(
        private auth: AuthService,
        private http: HttpClient,
        private utils: UtilsService
    ) { }

    editBio(bio: string) {
        this.http.post(
            API_URL + "updateStatus",
            { status: bio, token: this.auth.session.token }
        ).subscribe(res => {
            if ("error" in res)
                this.utils.errorToast(res["error"], 4000);
            else this.auth.updateUser();
        });
    }

    editFavColor(rgb: RGB) {
        this.http.post(
            API_URL + "changeFavColor",
            { r: rgb.r, g: rgb.g, b: rgb.b, token: this.auth.session.token }
        ).subscribe(res => {
            if ("error" in res)
                this.utils.errorToast(res["error"], 4000);
            else this.auth.updateUser();
        });
    }

    getColorClasses(): Observable<ColorClass[]> {
        return this.http.post<ColorClass[]>(API_URL + "allColors", {});
    }

}
