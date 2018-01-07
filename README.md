# koa2-session-redis

Middleware for [Koa2](https://github.com/koajs/koa) to get/set session use with Redis stores

Use native ES6(async/await) by Nodejs v7.x, use `--harmony` option.

Or you can use the old versions:
- [babel](https://github.com/Secbone/koa-session2/tree/babel)
- [node6](https://github.com/Secbone/koa-session2/tree/node6)

## Require
node v7.x +

## Install
```
npm install koa2-session-redis
```

## Usage
```js
const Koa = require("koa");
const session = require("koa2-session-redis");

const app = new Koa();

app.use(session({
  key: 'koa:sess',
  maxAge: 100000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  resave: true,    //resave every request
  redisCofig: {
      port: 6379,
      host: '127.0.0.1',
      db: 3,
      family: 4,
      password: '',
      options: {
          return_buffers: false,
          auth_pass: ''
      }
  }
}))
```



## Options

Most options based on [cookies](https://github.com/pillarjs/cookies#cookiesset-name--value---options--)

- `key`: a string for store session id in cookie

- `maxAge`: a number representing the milliseconds from `Date.now()` for expiry
- `expires`: a `Date` object indicating the cookie's expiration date (expires at the end of session by default).
- `path`: a string indicating the path of the cookie (`/` by default).
- `domain`: a string indicating the domain of the cookie (no default).
- `secure`: a boolean indicating whether the cookie is only to be sent over HTTPS (`false` by default for HTTP, `true` by default for HTTPS).
- `httpOnly`: a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (`true` by default).
- `signed`: a boolean indicating whether the cookie is to be signed (`false` by default). If this is true, another cookie of the same name with the `.sig` suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of _cookie-name_=_cookie-value_ against the first [Keygrip](https://www.npmjs.com/package/keygrip) key. This signature key is used to detect tampering the next time a cookie is received.
- `overwrite`: a boolean indicating whether to overwrite previously set cookies of the same name (`false` by default). If this is true, all cookies set during the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie.
- `resave`: refresh session id & session expires every request



## License

MIT