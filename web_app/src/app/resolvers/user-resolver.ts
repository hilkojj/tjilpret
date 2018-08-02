import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { UserService } from "../services/user.service";

@Injectable()
export class UserResolver implements Resolve<Observable<User>> {

    constructor(
        private users: UserService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        var id = +route.paramMap.get("id");
        return this.users.preLoadedProfileUser && this.users.preLoadedProfileUser.id == id ?
            Observable.of(this.users.preLoadedProfileUser)
            :
            this.users.userById(id);
    }

}