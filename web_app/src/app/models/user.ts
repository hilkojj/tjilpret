import { CONTENT_URL } from "../constants";

export class User {
    id: number;
    username: string;
    header: string;
    profilePic: string;
    bio: string;
    soundFragment: string;

    r: number;
    g: number;
    b: number;

    admin: boolean;
    appleUser: boolean;
    rep: number;
    joinedOn: number;

    friends: number;
    messages: number;

    profilePicUrl(dim: string): string {
        var profilePic = this.profilePic == null ? "default.png" : this.profilePic;
        return `${CONTENT_URL}profile_pics/${dim}/${profilePic}`;
    }

    headerUrl(dim: string): string {
        if (this.header == null) return "";
        return `${CONTENT_URL}headers/${dim}/${this.header}`;
    }

    get rgbString(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

}