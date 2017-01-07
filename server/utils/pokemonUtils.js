"use strict";

const bunyan = require('bunyan');
const pogobuf = require('pogobuf');

const props = require('../config/properties.js');
const pokemonData = require('../../data/pokemon.json');

const log = bunyan.createLogger({
	name: props.log.names.pokemonUtils,
	streams: [{
		level: props.log.levels.console,
		stream: process.stdout
	}]
})

let getToken = (credential) => {
	return new Promise((resolve, reject) => {
		let login = null;

		if(credential.login_type === 'google'){
			login = new pogobuf.GoogleLogin();
		} else {
			login = new pogobuf.PTCLogin();
		}

		login.login(credential.username, credential.password).then(token => {
			resolve(token);
		}, err => {
			log.trace('login.login() failed, rejecting from getToken');
			reject(err);
		});
	});
}

module.exports = {
	getClient: (credential) => {
		return new Promise((resolve, reject) => {
			const client = new pogobuf.Client();

			if (credential.token){
				client.setAuthInfo(credential.login_type, credential.token);
				client.init().then(() => {
					resolve(client);
				}, err => {
					getToken(credential).then(token => {
						client.setAuthInfo(credential.login_type, token);
						client.init().then(() => {
							resolve(client);
						}, err => {
							log.trace('client.init() failed, rejecting from getClient');
							reject(err);
						});
					}, err => {
						log.trace('getToken() failed, rejecting from getClient');
						reject(err);
					});
				});
			} else {
				getToken(credential).then(token => {
					client.setAuthInfo(credential.login_type, token);
					client.init().then(() => {
						resolve(client);
					}, err => {
						log.trace('client.init() failed, rejecting from getClient');
						reject(err);
					});
				}, err => {
					log.trace('getToken() failed, rejecting from getClient');
					reject(err);
				});
		  }
		});
	},

	getLevel: (pokemon) => {
		let cp = pokemon.cp_multiplier;
		if(pokemon.hasOwnProperty('additional_cp_multiplier')){
			cp += pokemon.additional_cp_multiplier
		}

		for(let level in props.pokemonCpMulipliersByLevel){
			if(props.pokemonCpMulipliersByLevel.hasOwnProperty(level) &&
				Math.abs(cp - props.pokemonCpMulipliersByLevel[level]) < 0.0001){
				return parseFloat(level);
			}
		}

		return 0;
	},

	getName: (pokemon) => {
		if(pokemon.hasOwnProperty('nickname') && pokemon.nickname.length > 0){
			return pokemon.nickname;
		}

		return pokemonData[pokemon.pokemon_id].Name;
	},

	getCandy: (pokemon, candies) => {
		for(let j = 0; j < candies.length; j++){
			let candy = candies[j];

			if(candy.hasOwnProperty('family_id') && candy.hasOwnProperty('family_id') && candy.family_id === pokemonData[pokemon.pokemon_id].FamilyId){
				return candy.candy;
			}
		}

		return 0;
	}
}
