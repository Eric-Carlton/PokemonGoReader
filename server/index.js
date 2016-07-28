"use strict";

const bunyan = require('bunyan');
const express = require('express');
const props = require('./properties.js');
const pogobuf = require('pogobuf');
const bodyParser = require('body-parser');

const log = bunyan.createLogger({
	name: props.log.names.index,
	streams: [{
		level: props.log.levels.console,
		stream: process.stdout
	}]
});

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.post('/api/player/get', (req, res) => {
	log.debug({
		body: req.body,
		ipAddress: req.connection.remoteAddress
	}, 'POST request to /api/player/get');

	const client = new pogobuf.Client();

	let login = null;
	let loginType = null;
	
	if(req.body.type === 'Google'){
		login = new pogobuf.GoogleLogin();
		loginType = 'google';
	} else {
		login = new pogobuf.PTCLogin();
		loginType = 'ptc';
	}

	log.trace({username:req.body.username, password: req.body.password}, 'Sending login request');
	login.login(req.body.username, req.body.password).then(token => {
		log.trace({token: token}, 'Token retrieved');
		client.setAuthInfo(loginType, token);
		//TODO: Get actual position
		client.setPosition(35.8963192, -78.8099471);

		client.init().then(() => {
			client.getPlayer().then(player => {
				const response = {player: player};
				const status = 200;

				log.debug({
					response: response,
					status: status
				}, 'Sending response from /api/player/get');
				res.status(status).send(response);
			}, err => {
				const response = {error: "Error occurred getting player info"};
				const status = 500;

				log.debug({response: response, status: status}, 'Sending response from /api/player/get');
				res.status(status).send(response);
			});
		});
	}, err => {
		log.error({error: err.message}, "Error occurred logging in");

		const response = {error: "Error occurred logging in"};
		const status = 500;

		log.debug({response: response, status: status}, 'Sending response from /api/player/get');
		res.status(status).send(response);
	});
});

const server = app.listen(props.server.port, () => {
	log.info("Listening on port %s...", server.address().port);
});