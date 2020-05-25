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
import { parseJSONObject } from './utils';

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
          });
        }

        if (result && typeof result === 'string') {
          const userProfileData = parseJSONObject(result);

          if (userProfileData) {
            const userProfile: UserProfile = this._formatProfileData(userProfileData as UserProfileData);

            return resolve({
              userProfile,
            });
          }
        }

        resolve({
          err: {
            type: 'parseError',
            message: 'Profile response was not a valid json object string',
          },
        });
      });
    });
  protected _formatProfileData = (profileData: UserProfileData): UserProfile => {
    const {
      profile: { acceptedFields },
    } = cfg;
    // construct user profile with accepted fields
    const userProfile: UserProfile = acceptedFields.reduce(
      (profile, { field, possibleExternalFields }) => {
        const rawData = profile._rawProfileData;

        const externalFieldName = possibleExternalFields.find(possibleField => rawData[possibleField]);

        if (externalFieldName) {
          return Object.assign({}, profile, { [field]: rawData[externalFieldName] });
        }

        return profile;
      },
      {
        id: '',
        _rawProfileData: profileData,
      } as UserProfile,
    );

    return userProfile;
  };
  // TODO -> process more error types
  protected _parseError = (err: GoogleAuthError): AuthenticationError => {
    const { data } = err;

    if (data) {
      const parsedErrorData = parseJSONObject(data);

      if (parsedErrorData) {
        // TODO -> parse status code to determine own auth type
        const { error = '', error_description: errorDescription = '' } = parsedErrorData as GoogleAuthErrorData;

        return {
          type: 'authError',
          message: error && errorDescription ? `${error} (${errorDescription})` : error || errorDescription,
        };
      }
    }

    return {
      type: 'authError',
      message: String(data),
    };
  };
}

export = TokenOauth;
