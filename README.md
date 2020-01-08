# node.keystonejs.jwt

> Project contains nodejs + express + keystonejs v4 + mongoDB + mongoose + nodemailer + jsonwebtoken

> include terms/tags that can be searched
Node + MongoDB + KeystoneJS + JWT with refresh token

**Badges**

- [nodejs](https://nodejs.org)
- [express](expressjs.com/)
- [keystonejs](https://v4.keystonejs.com/)
- [mongoDB](www.mongodb.com/‎)
- [mongoose](www.mongodb.com/‎)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [nodemailer](https://nodemailer.com/)
- JWT
- Refresh token
- Access token
- Rest api

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Models](#models)
- [RestApi](#restapi)
- [Env Params](#EnvParams)
- [Tests](#tests)
- [Links](#links)
- [License](#license)
- [Donate](#donate)

---

## Installation

### Clone

- Clone this repo to your local machine using `https://github.com/evgeniy-logvinov/node.keystonejs.jwt.git`

### Setup

- If you want more syntax highlighting, format your code like this:

> install packages first

```shell
$ npm install
```
or

```shell
$ yarn install
```
---

## Usage

- Project contains installed keystone js. To start project please run next command:

```shell
    npm run start
```
or

```shell
    yarn start
```

- Don't forget put [env params](#envParams) to file projectDir/.env
---

## Models
RefreshToken
* _refreshToken_: { type: `String` }
* _createdDate_: { type: `Date`, default: `Date.now`, required:  `true` }
* _lastActionAt_: { type: `Date`, default: `Date.now`, required: `true` }
* _expiredInDate_: {
		type: `Date`,
		`default`: () =>  `new Date(Date.now() + +process.env.JWT_REFRESH_TOKEN_LIFE)`,
		required: `true`,
	}
* _browser_: { type: `String` }
* _userAgent_: { type: `String` }
* _ip_: { type: `String` }
* _os_: { type: `String` }
* _user_: { type: `Types.Relationship`, ref: `'User'`, required: `true` }
* _active_: { type: `Boolean`, required: `true`, default: `false` }

User
* _name_: { type: `Types.Name`, required: `true`, index: `true` }
* _phone_: { type: `Types.Text`, min: `9`, max: `20`, initial: `true` },
* _activated_: { type: `Boolean`, initial: `true`, default: `process.env.SMTP_HAS_EMAIL_ACTIVATION !== 'true'` },
* _email_: { type: `Types.Email`, initial: `true`, required: `true`, unique: `true`, index: `true` },
* _emailPreferences_: { type: `Boolean`, initial: `true`, required: `true`, default: `true` },
* _password_: { type: `Types.Password`, initial: `true`, required: `true` },
},
* _'Permissions'_ {
    isAdmin: {
        type: `Boolean`, label: `'Can access Keystone'`,index: `true` }
}

---
## RestApi

### Security

* _post_ `/security/signup` signup user in system. Body params: email, password, confirmPassword, emailPreferences, phone, name.
* _get_ `/security/signup/activation/:id` activate user in system if it's needed. Request params: userId.
* _post_ `/security/signin` signin user to systemю Body params: email, password.
* _post_ `/security/signout` signout user from system. RefreshToken
* _get_ `/security/token` get user token by refresh token. RefreshToken
* _post_ `/security/refresh` get user refresh token. RefreshToken

### Users

* _get_ `/users/user/` get current user by token.
* _get_ `/users/sessions/` get current user sessions.
* _delete_ `/users/sessions/delete/:id` delete current user session by id. Request params: sessionId.
* _delete_ `/users/sessions/delete-all` delete all other user sessions. RefreshToken

---

## EnvParams
* _COOKIE_SECRET_ for keystonejs
* _MONGO_URI_ url to db in next format `mongodb://${user}:${pass}@${host}:${port}/{db_name}`
* _NODE_ENV_ `development/production`
* _AUTO_UPDATE_ param for keystone js auto update `true/false`
* _JWT_REFRESH_TOKEN_SECRET_ refresh token secret
* _JWT_SECRET_ token secret
* _JWT_REFRESH_TOKEN_LIFE_ refresh token life `86400`
* _JWT_TOKEN_LIFE_ token life `120000`
* _SMTP_HAS_EMAIL_ACTIVATION_ if we need send activation email `true`
* _SMTP_MAIL_ smtp mail in next format `account@host`
* _SMTP_PASS_ smtp pass
* _SMTP_HOST_ smtp host `smtp.googlemail.com`
* _SMTP_PORT_ smtp port `465`
* _SMTP_SECURE_ `true/false`
* _SMTP_SERVICE_NAME_ smtp message from `Auth Service`
* _SMTP_ACTIVATION_ADDRESS_ activation address path in email which send to new user, for `http://localhost:3000` will send `http://localhost:3000/${userId}`

---
<!--
## Tests

- Use jest inside `/packages/*` for each project and add this line to your `package.json` file

```js
    scripts: {
        "test:unit": "vue-cli-service test:unit --color"
    }
```

--- -->

## Support

Reach out to me at one of the following places!

- Github <a href="https://github.com/evgeniy-logvinov">`evgeniy-logvinov`</a>
- Facebook <a href="https://www.facebook.com/evgeniy.logvinov.k" target="_blank">`evgeniy.logvinov.k`</a>
- LinkedIn <a href="https://www.linkedin.com/in/evgeniy-logvinov-k/" target="_blank">`evgeniy-logvinov-k`</a>


---
## Links

- [Main Idea](https://gist.github.com/zmts/802dc9c3510d79fd40f9dc38a12bccfc)
- [Useful link #1](https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/)
- [Useful link #2](https://jasonwatmore.com/post/2018/08/06/nodejs-jwt-authentication-tutorial-with-example-api)
- [Useful link #3](https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4)
- [Useful link #4](https://tutorialedge.net/nodejs/nodejs-jwt-authentication-tutorial/)
- [Useful link #5](https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/)
- [Useful link #6](https://dev.to/_marcba/secure-your-node-js-application-with-json-web-token-4d4e)

---

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2019 © <a href="https://github.com/evgeniy-logvinov" target="_blank">EKL</a>.

## Donate
### [Coffee](https://www.buymeacoffee.com/YOtKlr9)
### [Cup of tea](https://money.yandex.ru/to/410018608949852)