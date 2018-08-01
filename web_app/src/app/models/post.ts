export enum PostType {
    Img = "img",
    Vid = "vid"
}

export interface Post {
    id: number
    title: string;
    description: string;
    duration?: number;
    type: PostType;
    time: number;
    views: number;
    path: string;
    thumbnailPath: string;
    score: number;
    comments: number;
}