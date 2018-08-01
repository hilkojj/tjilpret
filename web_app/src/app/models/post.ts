export enum PostType {
    Img = "img",
    Vid = "vid"
}

export interface Post {
    id: number
    title: string;
    description: string;
    type: PostType;
    time: number;
    views: number;
    path: string;
    thumbnailPath: string;
}