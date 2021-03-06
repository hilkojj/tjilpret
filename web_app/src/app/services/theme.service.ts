import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../models/user';

const styleSheetURL = "/assets/css/dynamic-stylesheet.css";

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    get darkThemeEnabled() {
        return this._darkThemeEnabled;
    }

    private _darkThemeEnabled: boolean;
    private css: string;
    private r: number = 94;
    private g: number = 94;
    private b: number = 255;

    user: User;

    constructor(
        private http: HttpClient
    ) { }

    load(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.http.get(styleSheetURL, {
                responseType: "text"
            }).subscribe(css => {
                $("head").append("<style id='dynamic-css'></style>");
                this.css = css;
                this.applyThemeColor(255, 255, 255);
                resolve(true);
            });
        });
    }

    update() {
        this.updateCSS();
    }

    applyFavColor(user: User) {
        this.user = user;
        this.updateCSS();
    }

    applyThemeColor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.user = null;

        this.updateCSS();
    }

    get rgbString(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    private updateCSS() {
        if (this.css == undefined) return;

        var r = this.r;
        var g = this.g;
        var b = this.b;

        if (this.user) {
            var u = this.user;
            r = u.r;
            g = u.g;
            b = u.b;
        }

        const darkColor = "rgb(36, 36, 43)";
        const darkColorpoint3 = "rgba(58, 58, 138, 0.1)";
        const darkColorpoint1 = "rgba(58, 58, 138, 0.1)";
        const darkTheme = localStorage.getItem("darkTheme") == "true";
        this._darkThemeEnabled = darkTheme;

        const values = {
            r: r, g: g, b: b,
            rgb: "rgb(" + r + "," + g + "," + b + ")",
            "rgb.6": "rgb(" + r * .6 + "," + g * .6 + "," + b * .6 + ")",

            bw: darkTheme ? darkColor : "white",
            bwOnBw: darkTheme ? "white" : "black",
            "bw.3": darkTheme ? darkColorpoint3 : "rgba(255,255,255,.3)",
            "bwOnBw.3": !darkTheme ? darkColorpoint3 : "rgba(255,255,255,.3)",
            "bw.1": darkTheme ? darkColorpoint1 : "rgba(255,255,255,.1)",
            "bwOnBw.1": !darkTheme ? darkColorpoint1 : "rgba(255,255,255,.1)",
            bwOnBwText: darkTheme ? "rgba(255,255,255,0.87)" : "rgba(0,0,0,0.87)"
        }
        var newCss = this.css;

        for (var key in values)
            newCss = newCss.split("?" + key + "?").join(values[key]);

        $("#dynamic-css").html(newCss);
        $("[name='theme-color']").remove();
        $("head").append("<meta name='theme-color' content='" + values.rgb + "'>");
    }

}
