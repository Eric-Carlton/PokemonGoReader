"use strict";

const bunyan = require('bunyan');
const bodyParser = require('body-parser');

const props = require('../config/properties.js');

const log = bunyan.createLogger({
	name: props.log.names.expressUtils,
	streams: [{
		level: props.log.levels.console,
		stream: process.stdout
	}]
})

module.exports = {
	sendResponse: (res, next, status, response, username, endpoint) => {
		log.debug({status: status, username: username}, 'Sending response from ' + endpoint);
		res.status(status).send(response);
		next();
	},
	initApp: (app) => {
		app.use(bodyParser.json());

		app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', props.cors.allowOrigin);
			res.header('Access-Control-Allow-Headers', props.cors.allowHeaders);
			next();
		});
	}
}