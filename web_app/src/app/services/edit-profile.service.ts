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
            else this.auth.updateUser(null);
        });
    }

    editFavColor(rgb: RGB, callback: () => void) {
        this.http.post(
            API_URL + "changeFavColor",
            { r: rgb.r, g: rgb.g, b: rgb.b, token: this.auth.session.token }
        ).subscribe(res => {
            if ("error" in res)
                this.utils.errorToast(res["error"], 4000);
            else this.auth.updateUser(callback);
        });
    }

    getColorClasses(): Observable<ColorClass[]> {
        return this.http.post<ColorClass[]>(API_URL + "allColors", {});
    }

    uploadProfilePic(image: File) {
        this.uploadImg(API_URL + "uploadProfilePic", "profilePic", image);
    }

    uploadBanner(image: File) {
        this.uploadImg(API_URL + "uploadHeader", "header", image);
    }

    private uploadImg(url: string, name: string, image: File) {
        const M = window["Materialize"];

        var toast = this.utils.loadingToast("Uplooden...");

        var fd = new FormData();
        fd.append("token", this.auth.session.token + "");
        fd.append(name, image, name);

        this.http.post(url, fd).subscribe(res => {

            if ("error" in res)
                this.utils.endLoadingToast(true, res["error"], toast);
            else
                this.utils.endLoadingToast(false, "Geniet ervan", toast);

            this.auth.updateUser(null);

        });

    }

    uploadSoundFragment(file: File) {
        if (file.size > 10000000)
            return alert("Jong, das wel een heel groot bestand. Hou het ff onder de 10mb (wat ook al veelste veel is)");

        var toast = this.utils.loadingToast("Geluidje uplooden...");

        var fd = new FormData();
        fd.append("token", this.auth.session.token + "");
        fd.append("soundFragment", file, "soundFragment");

        this.http.post(API_URL + "uploadSoundFragment", fd).subscribe(res => {

            if ("error" in res)
                this.utils.endLoadingToast(true, res["error"], toast);
            else
                this.utils.endLoadingToast(false, "Geniet, maar met mate", toast);

            this.auth.updateUser(null);

        });
    }

}
