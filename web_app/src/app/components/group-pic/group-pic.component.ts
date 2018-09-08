import { Component, OnInit, Input } from '@angular/core';
import { Conversation } from '../../models/chat';
import { PRIVATE_CONTENT_URL } from '../../constants';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-group-pic',
    templateUrl: './group-pic.component.html',
    styleUrls: ['./group-pic.component.scss']
})
export class GroupPicComponent implements OnInit {

    @Input() conv: Conversation;
    @Input() size: string;
    @Input() dim: string = "med";
    @Input() borderWidth: string = "0";
    @Input() cursor: string = "default";

    constructor(
        private san: DomSanitizer
    ) { }

    ngOnInit() {
    }

    get url(): string {
        if (this.conv.groupPic == null) return "/assets/img/default_group_pic.png";
        return PRIVATE_CONTENT_URL + "group_pic/" + this.dim + "/" + this.conv.groupPic;
    }

}
