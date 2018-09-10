import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Conversation } from "../models/chat";
import { ChatService } from "../services/chat.service";

@Injectable()
export class ConversationsResolver implements Resolve<Observable<boolean>> {

    constructor(
        private chatService: ChatService
    ) { }

    resolve(): Observable<boolean> {
        return this.chatService.conversations ? Observable.of(true) : this.chatService.conversationsLoaded;
    }

}