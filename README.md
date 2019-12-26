# node.keystonejs.jwt
Node + MongoDB + KeystoneJS + JWT with refresh token

# Models
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

# Rest api

## security

* post `/security/signup`
* get `/security/signup/activation/:id`
* post `/security/signin`
* post `/security/signout`
* get `/security/token`
* post `/security/refresh`

## users

* get `/users/user/`
* get `/users/sessions/`
* delete `/users/sessions/delete/:id`
* delete `/users/sessions/delete-all`

# Env params
* _COOKIE_SECRET_
* _MONGO_URI_ url to db in next format `mongodb://${user}:${pass}@${host}:${port}/{db_name}`
* _NODE_ENV_ `development/production`
* _AUTO_UPDATE_ param for keystone js auto update `true/false`
* _JWT_REFRESH_TOKEN_SECRET_ refresh token secret
* _JWT_SECRET_ token secret
* _JWT_REFRESH_TOKEN_LIFE_ refresh token life `86400`
* _JWT_TOKEN_LIFE_ token life `120000`
* _SMTP_MAIL_ smtp mail in next format `account@host`
* _SMTP_PASS_ smtp pass
* _SMTP_HOST_ smtp host `smtp.googlemail.com`
* _SMTP_PORT_ smtp port `465`
* _SMTP_SECURE_ `true/false`
* _SMTP_SERVICE_NAME_ smtp message from `Auth Service`
* _SMTP_ACTIVATION_ADDRESS_ activation address path in email which send to new user, for `http://localhost:3000` will send `http://localhost:3000/${userId}`
* _SMTP_HAS_EMAIL_ACTIVATION_ do we need send activation email `true`

# Main Idea

https://gist.github.com/zmts/802dc9c3510d79fd40f9dc38a12bccfc
