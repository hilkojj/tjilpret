import { Injectable } from "@angular/core";
import { Observable } from "../../../node_modules/rxjs";
import { User } from "../models/user";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { UserService } from "../services/user.service";

@Injectable()
export class UserResolver implements Resolve<Observable<User>> {

    constructor(
        private users: UserService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.users.userById(+route.paramMap.get("id"));
    }

}