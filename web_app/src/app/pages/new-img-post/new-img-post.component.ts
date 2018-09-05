import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { PostsService } from '../../services/posts.service';
import { Category } from '../../models/post';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'app-new-img-post',
    templateUrl: './new-img-post.component.html',
    styleUrls: ['./new-img-post.component.scss']
})
export class NewImgPostComponent implements OnInit {

    previewSrc: string;
    categories: Category[];
    file: File;

    uploading = false;

    title = "";
    description = "";
    categoryId = -1;
    rotate = 0;

    constructor(
        public service: PostsService,

        private router: Router,
        private utils: UtilsService
    ) { }

    ngOnInit() {

        this.file = this.service.imgToBeUploaded;
        this.service.imgToBeUploaded = null;

        if (!this.file)
            return this.router.navigate(["/dollepret"], { replaceUrl: true });

        if (this.file.size > 64000000) {
            alert("Platje mag nit groter zyn dan 64 mb!!?!?!?!?!?!");
            return history.back();
        }

        var fr = new FileReader();
        fr.onload = () => {
            this.previewSrc = fr.result;
        }
        fr.readAsDataURL(this.file);

        this.service.getCategories().subscribe(c => this.categories = c);

    }

    rotateImg(dir: number) {

        this.rotate += dir;

        if (this.rotate >= 4) this.rotate = 0;
        else if (this.rotate <= -4) this.rotate = 0;

    }

    upload() {
        var toast = this.utils.loadingToast("Platje uplooden....");
        this.uploading = true;
        this.service.uploadImgPost(this.file, this.title, this.description, this.categoryId, this.rotate).subscribe(res => {
            this.utils.endLoadingToast(res.error, res.error ? res.error : "Gelukt", toast);

            this.uploading = false;
            console.log(res);

            this.router.navigateByUrl("/uplood/" + res.id);
        })
    }

}
