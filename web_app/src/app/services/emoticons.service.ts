import { Injectable } from '@angular/core';
import { EmoticonCategory, Emoticon } from '../models/emoticons';
import { HttpClient } from '@angular/common/http';
import { API_URL, CONTENT_URL } from '../constants';
import { AuthService } from './auth.service';
import { Observable } from '../../../node_modules/rxjs';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class EmoticonsService {

    emoticons: EmoticonCategory[];

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private utils: UtilsService
    ) {
        setInterval(() => this.update(), 60000);
        auth.onAuthenticatedListeners.push(() => this.update());
    }

    update() {
        if (!this.auth.session) return;
        this.http.post<EmoticonCategory[]>(
            API_URL + "emoticons", { token: this.auth.session.token }
        ).subscribe(e => this.emoticons = e);
    }

    chooseFile() {
        document.getElementById("emoticon-file-input").click();
    }

    upload(name: string, categoryId: number, file: File): Observable<boolean> {

        var fd = new FormData();
        fd.append("emoticon", file, "emoticon");
        fd.append("name", name);
        fd.append("categoryId", categoryId + "");
        fd.append("token", this.auth.session.token + "");
        
        return this.http.post(API_URL + "uploadEmoticon", fd).map((res: any) => {

            if (res.success) return true;

            if (res.error) this.utils.errorToast(res.error, 6000);
            return false;
        });
    }

    emoticonsOfUser(userId: number): Observable<Emoticon[]> {
        return this.http.post<Emoticon[]>(API_URL + "emoticonsOfUser/" + userId, {});
    }

    emoticonUrl(name: string) {
        return `${CONTENT_URL}emoticons/${name.toLowerCase()}.png`;
    }

    deleteEmoticon(name: string): Observable<boolean> {
        return this.http.post(API_URL + "deleteEmoticon", {
            token: this.auth.session.token,
            emoticonName: name
        }).map((res: any) => res.success);
    }

}
