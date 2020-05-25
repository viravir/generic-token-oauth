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

export type UserProfileData = {
  [x: string]: string | number | {} | [];
};

// TODO -> add consistent fields (after testing with other services)
export type UserProfile = {
  id: string;
  name?: string;
  email?: string;
  _rawProfileData: UserProfileData;
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
  userProfile?: UserProfile;
};

export type JsonObject = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [x: string]: any;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [x: number]: any;
};
