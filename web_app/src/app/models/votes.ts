import { User } from "./user";

export interface Votes {

    upVotes: number;
    downVotes: number;
    myVote: number; // 1, 0 or -1

}

export interface VotesAndVoters {

    votes: Votes;
    upVoters: User[];
    downVoters: User[];
    
}