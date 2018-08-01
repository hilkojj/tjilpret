import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { CONTENT_URL } from '../constants';

const POST_UPLOADS_URL = CONTENT_URL + "post_uploads/";

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor() { }

    getThumbnailPath(post: Post) {
        return POST_UPLOADS_URL + post.thumbnailPath;
    }

}
