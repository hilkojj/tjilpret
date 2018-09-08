import { User } from "./user";

export interface Conversation {
    chatId: number,
    unread: number,
    joinedChatOn: number,
    leftChatOn: number,
    isChatAdmin: boolean,
    muted: boolean,
    readTime: number,
    startedBy: number,
    startedOn: number,
    isGroup: boolean,
    groupTitle: string,
    groupPic: string,
    groupDescription: string,
    latestMessage: Message,
    latestSenderUsername: string,
    otherUser: User
}

export interface Message {
    chatId: number,
    id: number,
    sentBy: number,
    sentOn: number,
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