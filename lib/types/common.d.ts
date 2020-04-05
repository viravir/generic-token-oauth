import { AuthenticationError } from './errors';
export declare type AuthType = 'code' | 'accessToken';
export declare type TokenOauthOptions = {
    authType: AuthType;
    clientId: string;
    clientSecret: string;
    authUrl: string;
    tokenUrl: string;
    profileUrl: string;
};
export declare type UserProfile = {
    [x: string]: string | object;
};
export declare type AuthenticationResult = {
    err?: AuthenticationError;
    userProfile?: UserProfile;
};
export declare type AccessTokenGetResult = {
    err?: AuthenticationError;
    accessToken: string;
};
export declare type UserProfileGetResult = {
    err?: AuthenticationError;
    userProfile: UserProfile;
};
