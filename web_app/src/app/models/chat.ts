import { User } from "./user";
import { RGB } from "./colors";

export interface Conversation {
    chatId: number,
    unread: number,
    joinedTimestamp: number,
    leftTimestamp: number,
    isChatAdmin: boolean,
    muted: boolean,
    readTimestamp: number,
    startedBy: number,
    startedTimestamp: number,
    isGroup: boolean,
    groupTitle: string,
    groupPic: string,
    groupDescription: string,
    latestMessage: Message,
    otherUser: User,

    messagesAndEvents?: MessageOrEvent[]
    loadingMore?: boolean
}

export interface Message {
    chatId: number,
    id: number,
    sentBy: number,
    senderUsername: string,
    senderProfilePic: string,
    senderFavColor: RGB,
    sentTimestamp: number,
    text: string,
    attachment: Attachment,
    oldTimeString?: string,  // only for old messages

    sender?: User
}

export enum AttachmentType {
    Giphy = "giphy",
    Upload = "upload"
}

export interface Attachment {
    id: number,
    type: AttachmentType,
    path: string,
    thumbnail?: string
}

export interface Event {
    id: number,
    chatId: number,
    type: string,
    timestamp: number,
    by: number, 
    who: number,
    byUsername: string,
    whoUsername: string
}

export interface MessageOrEvent {
    message?: Message,
    event?: Event
}