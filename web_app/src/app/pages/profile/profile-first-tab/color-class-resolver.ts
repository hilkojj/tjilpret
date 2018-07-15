import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ColorClass } from "../../../models/colors";
import { ProfileService } from "../../../services/profile.service";

@Injectable()
export class ColorClassResolver implements Resolve<Observable<ColorClass>> {

    constructor(
        private profile: ProfileService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ColorClass> {
        return this.profile.getColorClassByUserID(+route.paramMap.get("id"));
    }

}