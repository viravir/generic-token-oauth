import { expect } from 'chai';

import TokenOauth = require('../index');
import { TokenOauthOptions } from '../types/common';
import { InvalidOptionsError } from '../errors';
import cfg from '../config';

const mockTokenOauthConfig: TokenOauthOptions = {
  clientId: '123id',
  clientSecret: 'superSecret',
  authType: 'accessToken',
};

// TODO -> add stubs to test class methods without http calls

describe('Initialization', () => {
  it('Should export TokenOauth constructor', () => {
    expect(TokenOauth).not.to.be.undefined;
    expect(typeof TokenOauth).to.equal('function');
  });

  it('Should properly initialize', () => {
    const mockTokenOauth = new TokenOauth(mockTokenOauthConfig);

    expect(mockTokenOauth).not.to.be.undefined;
    expect(mockTokenOauth.name).to.equal('TokenOauth');
  });

  it('Should throw an error on empty options', () => {
    // TODO -> add custom error type
    // eslint-disable-next-line
    // @ts-ignore
    expect(() => new TokenOauth()).to.throw(Error);
  });

  it('Should throw an error when required options were not provided', () => {
    const configWithoutRequiredOptions = { ...cfg.oauth.defaultOptions };
    const expectedErrorMsg = cfg.oauth.errorMessages.invalidOptions;
    // eslint-disable-next-line
    // @ts-ignore
    expect(() => new TokenOauth(configWithoutRequiredOptions)).to.throw(InvalidOptionsError, expectedErrorMsg);
  });
});
