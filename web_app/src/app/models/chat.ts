import { User } from "./user";

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
    latestSenderUsername: string,
    otherUser: User,

    messages?: Message[]
}

export interface Message {
    chatId: number,
    id: number,
    sentBy: number,
    sentTimestamp: number,
    text: string,
    attachment: Attachment,
    oldTimeString?: string  // only for old messages
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