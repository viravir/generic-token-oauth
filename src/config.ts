const config = {
  oauth: {
    defaultOptions: {
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://www.googleapis.com/oauth2/v4/token',
      profileUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    errorMessages: {
      invalidOptions: 'Invalid Options: Please provide authType, clientId and clientSecret',
    },
  },
};

export default config;
