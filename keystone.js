// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();
require('./require.js')

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'Auth JWT',
	'brand': 'Auth JWT',

	'less': 'public',
	'static': 'public',
	'views': 'templates/views',
	'view engine': 'pug',
	'auto update': (process.env.AUTO_UPDATE === 'true'),

	'cloudinary folders': false,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('lib/models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', requireRoot('lib/routes'))

keystone.set('cors allow origin', true)

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	users: 'users',
})

// Start Keystone to connect to your database and initialise the web server

keystone.start();
