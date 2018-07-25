import { User } from "./user";

export interface Comment {
    id: number;
    user: User;
    time: number;
    text: string;
    giphy: string;
    subComments: Comment[];
    deleted: boolean;
}