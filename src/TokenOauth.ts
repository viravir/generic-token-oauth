import { OAuth2 } from 'oauth';

import { AuthenticationError, GoogleAuthError, GoogleAuthErrorData } from './types/errorTypes';
import {
  TokenOauthOptions,
  AuthType,
  UserProfileData,
  UserProfile,
  AuthenticationResult,
  AccessTokenGetResult,
  UserProfileGetResult,
  OauthOptionsValidationResult,
} from './types/common';
import { InvalidOptionsError } from './errors';
import cfg from './config';

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
    const { err } = this._validateOptions({ authType, clientId, clientSecret, authUrl, tokenUrl, profileUrl });
    if (err) {
      throw err;
    }

    this._authType = authType;
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._authUrl = authUrl || cfg.oauth.defaultOptions.authUrl;
    this._tokenUrl = tokenUrl || cfg.oauth.defaultOptions.tokenUrl;
    this._profileUrl = profileUrl || cfg.oauth.defaultOptions.profileUrl;

    this._oauth2 = new OAuth2(clientId, clientSecret, '', authUrl, tokenUrl);

    this._oauth2.useAuthorizationHeaderforGET(true);
  }
  protected _validateOptions = ({
    authType,
    clientId,
    clientSecret,
  }: TokenOauthOptions): OauthOptionsValidationResult => {
    if (!authType || !clientId || !clientSecret) {
      return {
        err: new InvalidOptionsError('Invalid Options: Please provide authType, clientId and clientSecret'),
      };
    }
    return {};
  };
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
              id: '',
              name: '',
              email: '',
            },
          });
        }

        const userProfileData: UserProfileData = JSON.parse(String(result));

        const userProfile: UserProfile = this._formatProfileData(userProfileData);

        resolve({
          userProfile,
        });
      });
    });
  protected _formatProfileData = (profileData: UserProfileData): UserProfile => {
    // Google sends id in 'sub' field
    const { id, sub, name, email } = profileData;
    return { id: id || sub, name, email };
  };
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
