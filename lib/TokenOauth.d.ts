import { OAuth2 } from 'oauth';
import { AuthenticationError, GoogleAuthError } from './types/errors';
import { TokenOauthOptions, AuthType, AuthenticationResult, AccessTokenGetResult, UserProfileGetResult } from './types/common';
declare class TokenOauth {
    name: string;
    protected _authType: AuthType;
    protected _clientId: string;
    protected _clientSecret: string;
    protected _authUrl: string;
    protected _tokenUrl: string;
    protected _profileUrl: string;
    protected _oauth2: OAuth2;
    constructor({ authType, clientId, clientSecret, authUrl, tokenUrl, profileUrl }: TokenOauthOptions);
    authenticate: (authCode: string) => Promise<AuthenticationResult>;
    protected _getAccessToken: (authCode: string) => Promise<AccessTokenGetResult>;
    protected _getUserProfile: (accessToken: string) => Promise<UserProfileGetResult>;
    protected _parseError: (err: GoogleAuthError) => AuthenticationError;
}
export = TokenOauth;
