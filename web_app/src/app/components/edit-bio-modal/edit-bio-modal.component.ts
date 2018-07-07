import { Component, OnInit, AfterViewInit, Host, AfterViewChecked } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../../services/auth.service';
import { EditProfileService } from '../../services/edit-profile.service';

@Component({
    selector: 'app-edit-bio-modal',
    templateUrl: './edit-bio-modal.component.html',
    styleUrls: ['./edit-bio-modal.component.scss'],
})
export class EditBioModalComponent implements OnInit {

    bio: string = "";
    maxLength = 255;
    active = false;

    constructor(
        @Host() private modal: ModalComponent,
        private auth: AuthService,
        private editProfile: EditProfileService
    ) { }

    ngOnInit() {
    }

    checkActive() {
        if (!this.active && this.modal.active) {
            this.active = true;
            this.bio = this.auth.session.user.bio;
        }

        return this.modal.active;
    }

    save() {
        this.editProfile.editBio(this.bio);
        history.back();
    }

}
