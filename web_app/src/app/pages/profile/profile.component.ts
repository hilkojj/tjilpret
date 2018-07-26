import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { Tab } from '../../components/tabs/tabs.component';
import { ModalService } from '../../services/modal.service';
import { ProfileService } from '../../services/profile.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    tabs: Tab[];

    id: number;
    user: User;

    soundFrag: Howl;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private theme: ThemeService,
        private service: ProfileService,

        public modals: ModalService,
        public auth: AuthService
    ) { }

    ngOnInit() {

        var user = this.route.snapshot.data.user as User;
        this.user = user;

        if (!user)
            return this.router.navigateByUrl("/tjiller-niet-gevonden", { replaceUrl: true });

        if (user.id == this.auth.session.user.id) {
            user = this.user = Object.assign(this.auth.session.user, user);
        }

        this.theme.applyFavColor(user);

        this.tabs = [
            new Tab("Profiel", null, "./"),
            new Tab("Vriends", null, "./vriends", user.friends),
            new Tab("Uploods", null, "./uploods", user.uploads),
            new Tab("Groeps", null, "./groeps", user.groups)
        ];


        if (this.service.autoPlaySoundFragment) this.playSound();
    }

    get bannerStyle() {
        if (this.user && this.user.header) {
            return {
                'background': `linear-gradient(transparent, transparent, transparent, rgba(0, 0, 0, .4)), 
                                url('${this.user.headerUrl('large')}') transparent`,
                'backgroundSize': 'cover'
            }
        } else return {};
    }

    ngOnDestroy() {
        this.stopSound();
    }

    playSound() {
        let sound = this.soundFrag = new Howl({
            src: [this.user.soundFragmentUrl],
            onend: () => this.soundFrag = null,
            onload: () => {
                if (this.soundFrag == null)
                    sound.stop();
            }
        });
        this.soundFrag.play();

    }

    stopSound() {
        if (this.soundFrag != null) {
            this.soundFrag.stop();
            this.soundFrag = null;
        }
    }

    autoPlayChanged() {
        if (this.service.autoPlaySoundFragment)
            this.playSound();
        else this.stopSound()
    }

}
