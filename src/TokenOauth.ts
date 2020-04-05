import { OAuth2 } from 'oauth';

import { AuthenticationError, GoogleAuthError, GoogleAuthErrorData } from './types/errors';
import {
  TokenOauthOptions,
  AuthType,
  UserProfile,
  AuthenticationResult,
  AccessTokenGetResult,
  UserProfileGetResult,
} from './types/common';

class TokenOauth {
  public name = 'TokenOauth';
  protected _authType: AuthType;
  protected _clientId: string;
  protected _clientSecret: string;
  protected _authUrl: string;
  protected _tokenUrl: string;
  protected _profileUrl: string;
  protected _oauth2: OAuth2;
  constructor({ authType, clientId, clientSecret, authUrl, tokenUrl, profileUrl }: TokenOauthOptions) {
    // TODO -> validate params
    this._authType = authType;
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._authUrl = authUrl;
    this._tokenUrl = tokenUrl;
    this._profileUrl = profileUrl;

    this._oauth2 = new OAuth2(clientId, clientSecret, '', authUrl, tokenUrl);

    this._oauth2.useAuthorizationHeaderforGET(true);
  }
  public authenticate = async (authCode: string): Promise<AuthenticationResult> => {
    try {
      const { err: accessTokenErr, accessToken }: AccessTokenGetResult = await this._getAccessToken(authCode);

      if (accessTokenErr) {
        return { err: accessTokenErr };
      }

      const { err: userProfileErr, userProfile } = await this._getUserProfile(accessToken);

      if (userProfileErr) {
        return { err: userProfileErr };
      }

      return { userProfile };
    } catch (err) {
      // TODO -> write own error types
      return { err };
    }
  };
  protected _getAccessToken = (authCode: string): Promise<AccessTokenGetResult> =>
    new Promise(resolve => {
      if (this._authType === 'accessToken') {
        return resolve({ accessToken: authCode });
      }

      this._oauth2.getOAuthAccessToken(authCode, {}, (err, accessToken) => {
        if (err) {
          const parsedErr = this._parseError(err);

          return resolve({ err: parsedErr, accessToken: '' });
        }

        resolve({ accessToken });
      });
    });
  protected _getUserProfile = (accessToken: string): Promise<UserProfileGetResult> =>
    new Promise(resolve => {
      this._oauth2.get(this._profileUrl, accessToken, (err, result) => {
        if (err) {
          const parsedErr = this._parseError(err);

          return resolve({
            err: parsedErr,
            userProfile: {
              name: '',
              email: '',
            },
          });
        }

        // TODO -> format profile data to always have consistent fields
        // (like an id)
        const userProfile: UserProfile = JSON.parse(String(result));

        resolve({
          userProfile,
        });
      });
    });
  protected _parseError = (err: GoogleAuthError): AuthenticationError => {
    const { data } = err;
    // TODO -> parse status code to determine own auth type
    const parsedError = {
      type: 'authError',
      message: '',
    };

    if (data) {
      try {
        const { error = '', error_description: errorDescription = '' }: GoogleAuthErrorData = JSON.parse(data);

        parsedError.message = error && errorDescription ? `${error} (${errorDescription})` : error || errorDescription;
      } catch {
        // data prop is not a valid json string
        parsedError.message = String(data);
      }
    }

    return parsedError;
  };
}

export = TokenOauth;
