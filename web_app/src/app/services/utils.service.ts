import { Injectable } from '@angular/core';

const Materialize = window["Materialize"];

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor() { }

    navbarVisible = false;

    private _mobile: boolean;

    get mobile(): boolean {
        if (this._mobile == null) this._mobile = /Mobi/.test(navigator.userAgent);
        return this._mobile;
    }

    successToast(message: string, duration: number) {
        this.toast(
            "<i class=\"material-icons green-text\" style=\"margin-right: 10px\">check_circle</i>"
            + message, duration
        );
    }

    errorToast(message: string, duration: number) {
        this.toast(
            "<i class=\"material-icons red-text\" style=\"margin-right: 10px\">error</i>"
            + message, duration
        );
    }

    toast(message: string, duration: number) {
        Materialize.toast(message, duration);
    }

    loadingToast(text: string) {
        return Materialize.toast(
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
            ${text}`
        );
    }

    endLoadingToast(error: boolean, text: string, toast) {
        if (error)
            toast.el.innerHTML = "<i class=\"material-icons\" style=\"margin-right: 20px\">error</i>"
                + text;

        else
            toast.el.innerHTML = "<i class=\"material-icons\" style=\"margin-right: 20px\">check</i>"
                + text;

        setTimeout(() => toast.remove(), error ? 6000 : 3000);
    }

    htmlText(string: string): string {
        return string == null ? ""
            : string.split("<").join("&lt;").split(">").join("&gt;").replace(/\n/g, "<br>");
    }

}
