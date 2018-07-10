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

        var toast = M.toast(
            `<div class="preloader-wrapper small active" style="margin-right: 20px; width: 28px; height: 28px;">
                <div class="spinner-layer">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
                </div>
            </div>
            Uplooden....`
        );

        var fd = new FormData();
        fd.append("token", this.auth.session.token + "");
        fd.append(name, image, name);

        this.http.post(url, fd).subscribe(res => {

            if ("error" in res)
                toast.el.innerHTML = "<i class=\"material-icons\" style=\"margin-right: 20px\">error</i>"
                    + res["error"];
            else
                toast.el.innerHTML = "<i class=\"material-icons\" style=\"margin-right: 20px\">check</i>Geniet ervan";

            setTimeout(() => toast.remove(), "error" in res ? 6000 : 3000);
            this.auth.updateUser(null);

        });

    }

}
