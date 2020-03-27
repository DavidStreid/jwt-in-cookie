## Description
Wrapper around the functionality of jsonwebtoken to easily set and validate JWT tokens in express requests/responses

## QuickStart
### 1) Configuration
```
const jwtInCookie = require("jwt-in-cookie");
jwtInCookie.configure({secret: 'MY_SECRET'});
```

### 2) Setting JWT in request-cookie
```
function (req, res) {
    jwtInCookie.addCookieToken(res, data);
    ...
}
```

### 3) Validating JWT in response
```
function (req, res) {
    jwtInCookie.validateRequestCookie(req);
    ...
}

```
## API

### jwtInCookie.configure(config)
`config` object literal

Configures the instance of jwt-in-cookie 

Return: void

* `secret`: string (required), secret to be used to sign the JWT 
  > Eg: `abcdefghijklmnopqrstuvwxyz1234567890`
* `timeoutDuration`: string, length of time before signed data expires
  > Eg: `"2 hours"`,  `"1d"`, `"20h"`, `60`

### jwtInCookie.addCookieToken(res, payload, cookieOptions)

Adds payload as a token in the response cookie using configured secret & options

Return: string, token of payload

`res` [express response object](https://expressjs.com/en/api.html#res)  
`payload` object
`cookieOptions` object, options that set in the cookie 
* `httpOnly`: boolean, javascript can't access the cookie
* `expires`: number, time until the cookie expires (if 0, will expire at end of session)

### jwtInCookie.encodePayload(payload)  

Encodes payload using configured secret & options

Return: encoded payload

`payload` object
`cookieOptions` object, options that set in the cookie 
* `httpOnly`: boolean, javascript can't access the cookie
* `expires`: number, time until the cookie expires (if 0, will expire at end of session)
const encodePayload = function(payload)

### jwtInCookie.retrieveTokenFromCookie(req)

Retrieves the JWT from the input request's cookie (must be preceded by `jwtInCookie.configure`)

Return: encoded token
  
`req` [express request object](https://expressjs.com/en/api.html#req)  

### jwtInCookie.validateRequestCookie(req)

Returns whether request contains a valid JWT in its cookie (must be preceded by `jwtInCookie.configure`)

Return: boolean
  
`req` [express request object](https://expressjs.com/en/api.html#req)  
