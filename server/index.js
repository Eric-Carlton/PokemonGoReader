"use strict";

const bunyan = require('bunyan');
const express = require('express');

const props = require('./config/properties.js');
const expressUtils = require('./utils/expressUtils.js');
const pokemonRoutes = require('./routes/pokemonRoutes.js');

const log = bunyan.createLogger({
	name: props.log.names.index,
	streams: [{
		level: props.log.levels.console,
		stream: process.stdout
	}]
});

const app = express();

expressUtils.initApp(app);

pokemonRoutes.createRoutes(app);

const server = app.listen(props.server.port, () => {
	log.info(props.server.listeningMsg, props.server.port);
});