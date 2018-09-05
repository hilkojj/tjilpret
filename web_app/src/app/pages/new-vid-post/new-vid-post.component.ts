import { Component, OnInit, Sanitizer } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { PostsService } from '../../services/posts.service';
import { Category } from '../../models/post';
import { UtilsService } from '../../services/utils.service';
import { DomSanitizer, SafeResourceUrl } from '../../../../node_modules/@angular/platform-browser';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { Observable, Subscription } from '../../../../node_modules/rxjs';

@Component({
    selector: 'app-new-vid-post',
    templateUrl: './new-vid-post.component.html',
    styleUrls: ['./new-vid-post.component.scss']
})
export class NewVidPostComponent implements OnInit {

    previewURL: SafeResourceUrl;
    categories: Category[];
    file: File;

    uploading = false;
    uploadRequest: Subscription;
    toast;

    title = "";
    description = "";
    categoryId = -1;
    thumbnailPercentage = .1;

    constructor(
        public service: PostsService,

        private router: Router,
        private utils: UtilsService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {

        this.file = this.service.vidToBeUploaded;
        this.service.vidToBeUploaded = null;

        if (!this.file)
            return this.router.navigate(["/dollepret"], { replaceUrl: true });

        if (this.file.size > 1_000_000_000) {
            alert("Vido mag nit mir dan 1GB!!!!! (1gb is al veelste vil trouwens)");
            return history.back();
        }

        this.previewURL = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.file));

        this.service.getCategories().subscribe(c => this.categories = c);

    }

    upload() {
        this.toast = this.utils.loadingToast("Vido uplooden.. (<span id='percentage'>0%</span>)");
        this.uploading = true;
        this.uploadRequest = this.service.uploadVidPost(
            this.file, this.title, this.description, this.categoryId, this.thumbnailPercentage
        ).subscribe(event => {

            console.log(event);

            if (event.type === HttpEventType.UploadProgress) {

                this.toast.el.querySelector('#percentage').innerHTML = (event.loaded / event.total * 100 | 0) + "%";

            } else if ("body" in event) {
                var res = event.body;

                this.utils.endLoadingToast(res.error, res.error ? res.error : "Gelukt", this.toast);
                this.uploading = false;
                
                this.router.navigateByUrl("/uplood/" + res.id);
            }
        })
    }

    cancel() {
        confirm('uploden annuleren?!?!') && (() => {
            if (this.uploadRequest) {
                this.uploadRequest.unsubscribe();
                this.utils.endLoadingToast(true, "Uploden geannuleerd", this.toast);
            }
            return true;
        })() && history.back()
    }

}
