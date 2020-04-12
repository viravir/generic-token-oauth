import { AuthenticationError } from './errorTypes';
import { InvalidOptionsError } from '../errors';

export type AuthType = 'code' | 'accessToken';

export type TokenOauthOptions = {
  authType: AuthType;
  clientId: string;
  clientSecret: string;
  authUrl?: string;
  tokenUrl?: string;
  profileUrl?: string;
};

export type OauthOptionsValidationResult = {
  err?: InvalidOptionsError;
};

export type UserProfile = {
  [x: string]: string | object;
};

export type AuthenticationResult = {
  err?: AuthenticationError;
  userProfile?: UserProfile;
};

export type AccessTokenGetResult = {
  err?: AuthenticationError;
  accessToken: string;
};

export type UserProfileGetResult = {
  err?: AuthenticationError;
  userProfile: UserProfile;
};
