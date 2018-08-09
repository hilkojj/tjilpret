import { Directive, Input, ElementRef, OnChanges } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Directive({
    selector: '[profileLink]'
})
export class ProfileLinkDirective implements OnChanges {

    @Input() profileLink: User;

    initialized = false;

    constructor(
        private el: ElementRef,
        private service: UserService
    ) { }

    ngOnChanges() {
        if (this.initialized || !this.profileLink) return;
        var elem = this.el.nativeElement;
        elem.href = "/tjiller/" + this.profileLink.id;
        elem.onclick = () => {
            this.service.showProfile(this.profileLink);
            return false;
        }
        this.initialized = true;
    }



}
