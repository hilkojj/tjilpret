import { CONTENT_URL } from "../constants";

export class User {
    id: number;
    username: string;
    header: string;
    profilePic: string;
    r: number;
    g: number;
    b: number;

    profilePicUrl(dim: string): string {
        var profilePic = this.profilePic == null ? "default.png" : this.profilePic;
        return `${CONTENT_URL}profile_pics/${dim}/${profilePic}`;
    }

    get rgbString(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

}