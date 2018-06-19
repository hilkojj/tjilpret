import { Injectable } from '@angular/core';

const Materialize = window["Materialize"];

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor() { }

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

    htmlText(string: string): string {
        return string == null ? ""
            : string.split("<").join("&lt;").split(">").join("&gt;").replace(/\n/g, "<br>");
    }

}
