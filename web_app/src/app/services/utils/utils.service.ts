import { Injectable } from '@angular/core';

const Materialzie = window["Materialize"];

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
        Materialzie.toast(message, duration);
    }

}
