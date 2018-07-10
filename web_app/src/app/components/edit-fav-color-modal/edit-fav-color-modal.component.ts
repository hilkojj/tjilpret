import { Component, OnInit, Host } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../../services/auth.service';

import * as ColorConvert from 'color-convert';
import { EditProfileService } from '../../services/edit-profile.service';
import { ColorClass, HSL } from '../../models/colors';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-edit-fav-color-modal',
    templateUrl: './edit-fav-color-modal.component.html',
    styleUrls: ['./edit-fav-color-modal.component.scss']
})
export class EditFavColorModalComponent implements OnInit {

    active = false;
    hsl: HSL;
    colorClasses: ColorClass[];

    constructor(
        @Host() private modal: ModalComponent,
        private auth: AuthService,
        private editProfile: EditProfileService,
        private theme: ThemeService
    ) { }

    ngOnInit() {
    }

    checkActive() {
        if (!this.active && this.modal.active) {
            this.active = true;

            this.editProfile.getColorClasses().subscribe(classes => this.colorClasses = classes);

            var u = this.auth.session.user;
            var c = ColorConvert.rgb.hsl(u.r, u.g, u.b);
            this.hsl = { h: c[0], s: c[1], l: c[2] };


        } else if (!this.modal.active)
            this.active = false;


        return true;
    }

    private _colorClass: ColorClass = {
        id: -1,
        name: "...",
        description: "...",
        max_saturation: 0,
        max_hue: 0,
        max_lightness: 0,
        people: 0
    };

    get colorClass(): ColorClass {

        if (!this.active || this.colorClasses == null || this.hsl == null)
            return this._colorClass;

        var colorClass: ColorClass = null;
        for (var i in this.colorClasses) {
            var c = this.colorClasses[i];
            if (this.hsl.s < c.max_saturation * 100) {
                colorClass = c;
                break;
            } else if (this.hsl.h < c.max_hue && colorClass == null) {
                colorClass = c;
            }
        }
        if (colorClass == null)
            colorClass = this.colorClasses[0]; // red

        this._colorClass = colorClass;
        return colorClass;
    }

    get hslString() {
        return `hsl(${this.hsl.h}, ${this.hsl.s}%, ${this.hsl.l}%)`;
    }

    save() {
        var rgb = ColorConvert.hsl.rgb(
            this.hsl.h, this.hsl.s, this.hsl.l
        );
        this.editProfile.editFavColor({ r: rgb[0], g: rgb[1], b: rgb[2] }, () => history.back());
    }

}
