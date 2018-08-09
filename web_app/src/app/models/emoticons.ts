
export interface Emoticon {
    name: string;
    timesUsed: number;
    uploaderId: number;
    uploadedOn: number;
}

export interface EmoticonCategory {
    id: number;
    name: string;
    exampleEmoticon: string;
    emoticons?: Emoticon[];
}