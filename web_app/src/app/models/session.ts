import { User } from "./user";

export class Session {

    constructor(
        public token: number,
        public user: User
    ) {
        console.log(`new session created for ${user.username}`);
    }

}