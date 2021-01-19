export interface PublicationInterface {
    id: string;
    title?: string;
    description: string;
    photo?: string;
    file?: string;
    date: Date;
    userId: string;
    userName?: string;
    userPhoto?: string;
    idSaved?: string;
    idUserSave?: string;
    videoURL?:any;
}
