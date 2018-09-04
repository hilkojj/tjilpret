export enum PostType {
    Img = "img",
    Vid = "vid",
    Gif = "gif"
}

export interface Category {
    id: number;
    title: string;
    description: string;
}

export interface Post {
    id: number;
    title: string;
    description: string;
    duration?: number;
    type: PostType;
    time: number;
    views: number;
    path: string;
    uploadedBy: number;
    thumbnailPath: string;
    score: number;
    comments: number;
}