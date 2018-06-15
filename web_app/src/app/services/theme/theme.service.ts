import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { resolve } from 'dns';
import { reject } from 'q';

const styleSheetURL = "/assets/css/dynamic-stylesheet.css";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private css: string;
  private r: number = 94;
  private g: number = 94;
  private b: number = 255;

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
        this.applyThemeColor(this.r, this.g, this.b);
        resolve(true);
      });
    });
  }

  applyThemeColor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;

    if (this.css == undefined) return;

    const values = {
      r: r, g: g, b: b,
      rgb: "rgb(" + r + "," + g + "," + b + ")",
      rgbSec: "rgb(55, 255, 135)"
    }
    var newCss = this.css;

    for (var key in values)
      newCss = newCss.split("?" + key + "?").join(values[key]);

    $("#dynamic-css").html(newCss);
    $("[name='theme-color']").remove();
    $("head").append("<meta name='theme-color' content='" + values.rgb + "'>");
  }

}
