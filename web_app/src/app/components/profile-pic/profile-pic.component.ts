import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user';
import { Howl } from 'howler';
import { UtilsService } from '../../services/utils.service';
import * as $ from 'jquery'; // sorry

@Component({
    selector: 'app-profile-pic',
    templateUrl: './profile-pic.component.html',
    styleUrls: ['./profile-pic.component.scss']
})
export class ProfilePicComponent implements OnInit {

    @Input() user: User;
    @Input() size: string;
    @Input() dim: string = "med";
    @Input() borderWidth: string = "0";
    @Input() playSoundFragOnHover = false;
    @Input() cursor: string = "default";

    id = "profile-pic-" + (Math.random() * 1000 | 0);

    private soundFrag: Howl;
    private soundFragStopTimeout;
    private checkInterval;

    @Output() onProfilePicClick = new EventEmitter();

    constructor(
        private utils: UtilsService
    ) { }

    ngOnInit() {
        this.playSoundFragOnHover = this.playSoundFragOnHover && !this.utils.mobile;
    }

    playSoundFragment() {
        if (!this.user.soundFragment) return;

        if (this.soundFrag != null) {

            if (this.soundFragStopTimeout != null) clearTimeout(this.soundFragStopTimeout);

            this.soundFrag.fade(this.soundFrag.volume(), 1, 200);

            return;
        }

        var sound = this.soundFrag = new Howl({
            src: [this.user.soundFragmentUrl],
            onend: () => this.soundFrag = null,
            onload: () => {
                if (this.soundFrag == null)
                    sound.stop();
            }
        });
        this.soundFrag.play();
        this.checkInterval = setInterval(() => {

            if ($(`#${this.id}:hover`).length == 0) {
                this.stopSoundFragment();
                clearInterval(this.checkInterval);
            }

        }, 500);
    }

    stopSoundFragment() {

        if (this.soundFrag == null) return;

        var fadeDuration = 400;

        this.soundFrag.fade(this.soundFrag.volume(), 0, fadeDuration);
        this.soundFragStopTimeout = setTimeout(() => {

            this.soundFragStopTimeout = null;
            this.soundFrag.stop();
            this.soundFrag = null;

        }, fadeDuration);

    }

}
