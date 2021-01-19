export interface PublicationInterface {
    id: string;
    title?: string;
    description: string;
    image?: string;
    file?: string;
    file1?: string;
    video?: string;
    date: Date;
    userId: string;
    category?: string;
    userName?: string;
    userPhoto?: string;
    idSaved?: string;
    idUserSave?: string;
    idReport?: string;
    idUserReported?: string;
    commentReport?: string;
    reasonReport?: string;
    state?: string;
    videoURL?:any;
}
