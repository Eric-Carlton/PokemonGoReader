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
	res.header('Access-Control-Allow-Origin', props.cors.allowOrigin);
	res.header('Access-Control-Allow-Headers', props.cors.allowHeaders);
	next();
});

app.post(props.routes.root + props.routes.pokemon, (req, res, next) => {
	const endpoint = props.routes.root + props.routes.pokemon;
	log.debug(
		{username: req.body.username}, 
		'POST request to ' + endpoint);

	if(!req.body.hasOwnProperty('username')){
		sendResponse(res, next, 400, {error: props.errors.username}, req.body.username, endpoint);
	} else if (!req.body.hasOwnProperty('password')) { 
		sendResponse(res, next, 400, {error: props.errors.password}, req.body.username, endpoint);
	} else if (!req.body.hasOwnProperty('type')) { 
		sendResponse(res, next, 400, {error: props.errors.type}, req.body.username, endpoint);
	} else {
		let lat = props.coords.lat;
		let lng = props.coords.lng;

		if(req.body.hasOwnProperty('coords')){
			if (req.body.coords.hasOwnProperty('lat')) {
				lat = req.body.coords.lat;
			}
			if (req.body.coords.hasOwnProperty('lng')) {
				lng = req.body.coords.lng;
			}
		}

		const client = new pogobuf.Client();

		let login = null;
		
		if(req.body.type.toLowerCase() === 'google'){
			login = new pogobuf.GoogleLogin();
		} else {
			login = new pogobuf.PTCLogin();
		}

		login.login(req.body.username, req.body.password).then(token => {
			client.setAuthInfo(req.body.type.toLowerCase(), token);
			client.setPosition(lat, lng);

			client.init().then(() => {
				client.getInventory(0).then(inventory => {
					if (!inventory.success){
						sendResponse(res, next, 500, {error: props.errors.inventory}, req.body.username, endpoint);
					}
					sendResponse(res, next, 200, {pokemon: pogobuf.Utils.splitInventory(inventory).pokemon}, req.body.username, endpoint);
				}, err => {
					log.error({err: err.message});
					sendResponse(res, next, 500, {error: props.errors.inventory}, req.body.username, endpoint)
				});
			});
		}, err => {
			log.error({err: err.message});
			sendResponse(res, next, 500, {error: props.errors.login}, req.body.username, endpoint);
		});
	}
});

function sendResponse(res, next, status, response, username, endpoint) {
	log.debug({status: status, username: username}, 'Sending response from ' + endpoint);
	res.status(status).send(response);
	next();
}

const server = app.listen(props.server.port, () => {
	log.info(props.server.listeningMsg, props.server.port);
});