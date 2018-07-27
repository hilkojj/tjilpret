import { User } from "./user";
import { Votes } from "./votes";

export interface Comment {
    id: number;
    user: User;
    time: number;
    text: string;
    giphy: string;
    subComments: Comment[];
    votes: Votes;
    deleted: boolean;
}