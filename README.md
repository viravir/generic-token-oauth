# generic-token-oauth
Provides token oauth authorization without redirecting for any third-party service

### Note
This package is intended to use with node.js

### Installation
`npm i generic-token-oauth`

## Usage
Example with google services:
```javascript
  const TokenOauth = require('./generic-token-oauth');
  
  const tokenOauth = new TokenOauth({
    authType: 'accessToken',
    clientId: 'clientId',
    clientSecret: 'superSecret',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://www.googleapis.com/oauth2/v4/token',
    profileUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
  )};
  
  const accessToken = 'accessToken123';
  
  const { err, userProfile } = tokenOauth.authorize(accessToken);
  
  const oauthCode = 'codeToPassToBackEnd';
  
  const { err, userProfile } = tokenOauth.authorize(oauthCode);
```

### TODO
– [x] Basic implementation (google services)
– [ ] Format profile data to provide consistent return type
– [ ] Write own error types
– [ ] Add tests
- [ ] Modify lib (if needed) to use it with different services (test with Facebook and Twitter)
- [ ] Refactor code

### Warning
Lib was tested to work with google services only, it may not yet work with other services!
