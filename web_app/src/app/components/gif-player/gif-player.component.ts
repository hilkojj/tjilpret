import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Giphy, GiphyService } from '../../services/giphy.service';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'app-gif-player',
    templateUrl: './gif-player.component.html',
    styleUrls: ['./gif-player.component.scss']
})
export class GifPlayerComponent implements OnInit, OnChanges {

    @Input() giphyId: string;
    // OR GIVE GIPHY OBJECT:
    @Input() giphy: Giphy;

    // OR SET PROPERTIES MANUALLY:
    @Input() dimensions: { x: number, y: number };
    @Input() stillUrl: string;
    @Input() url: string;

    @Input() fullHeight = true;
    @Input() showGiphyLogo = false;
    @Input() autoPlay = false;
    @Input() preload = false;
    @Input() lowQuality = false;

    playing = false;
    loaded = false;
    mobile: boolean;

    constructor(
        private service: GiphyService,
        private utils: UtilsService
    ) { }

    ngOnInit() {

        this.mobile = this.utils.mobile;

        if (this.giphyId)
            this.service.giphyById(this.giphyId).subscribe(giphy => {
                this.giphy = giphy;
                this.setPropertiesFromGiphy();
            });

        else if (this.giphy) this.setPropertiesFromGiphy();

    }

    ngOnChanges() {
        this.ngOnInit();
    }

    setPropertiesFromGiphy() {
        var still = this.giphy.images.fixed_width_still;

        this.stillUrl = still.url.split("?")[0];
        this.dimensions = {
            x: still.width,
            y: still.height
        }

        var gif = this.lowQuality ? this.giphy.images.fixed_width_small : this.giphy.images.downsized;

        this.url = gif.url.split("?")[0];
    }

    onInViewport() {
        if (this.autoPlay) this.playing = true;
    }

    onNotInViewport() {
        this.playing = false;
    }

    get containerStyle() {
        return this.fullHeight
            ? {} :
            {
                paddingTop: (this.dimensions.y / this.dimensions.x * 100 | 0) + "%"
            };
    }

}
