export interface UserInterface{
    uid: string;
    email: string;
    name?: string;
    description?: string;
    photo?: string;
    password: string;
    emailVerified: boolean;
    displayName?: string;
    idFollow?: string;
    idUserFollower?: string;
    idUserFollow?: string;
    countFollowers?: number;
}
