import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user';
import { CONTENT_URL, MOBILE } from '../../constants';
import { Howl } from 'howler';

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

    private soundFrag: Howl;
    private soundFragStopTimeout;

    @Output() onProfilePicClick = new EventEmitter();

    constructor(
    ) { }

    ngOnInit() {
        this.playSoundFragOnHover = this.playSoundFragOnHover && !MOBILE;
    }

    playSoundFragment() {
        if (!this.user.soundFragment) return;

        if (this.soundFrag != null) {

            if (this.soundFragStopTimeout != null) clearTimeout(this.soundFragStopTimeout);

            this.soundFrag.fade(this.soundFrag.volume(), 1, 200);

            return;
        }

        this.soundFrag = new Howl({
            src: [CONTENT_URL + `sound_fragments/${this.user.soundFragment}`],
            onend: () => this.soundFrag = null
        });
        this.soundFrag.play();
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
