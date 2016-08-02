"use strict";

const bunyan = require('bunyan');
const pogobuf = require('pogobuf');

const props = require('../config/properties.js');
const expressUtils = require('../utils/expressUtils.js');

const Pokemon = require('../models/Pokemon.js');

const log = bunyan.createLogger({
	name: props.log.names.pokemonRoutes,
	streams: [{
		level: props.log.levels.console,
		stream: process.stdout
	}]
});

module.exports = {
	createRoutes: (app) => {
		app.post(props.routes.root + props.routes.pokemon, (req, res, next) => {
			const endpoint = props.routes.root + props.routes.pokemon;
			log.debug(
				{username: req.body.username}, 
				'POST request to ' + endpoint);

			if(!req.body.hasOwnProperty('username')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.username}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('password')) { 
				expressUtils.sendResponse(res, next, 400, {error: props.errors.password}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('type')) { 
				expressUtils.sendResponse(res, next, 400, {error: props.errors.type}, req.body.username, endpoint);
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
								expressUtils.sendResponse(res, next, 500, {error: props.errors.inventory}, req.body.username, endpoint);
							}

							let rawPokemon = pogobuf.Utils.splitInventory(inventory).pokemon;
							let formattedPokemon = [];

							for(let i = 0; i < rawPokemon.length; i++){
								let pokemon = rawPokemon[i];

								if(pokemon.hasOwnProperty('is_egg') && !pokemon.is_egg){
									let name = props.pokemonNamesByDexNum[pokemon.pokemon_id.toString()];
									if(pokemon.hasOwnProperty('nickname') && pokemon.nickname.length > 0){
										name = pokemon.nickname;
									}

									formattedPokemon.push(new Pokemon(
										pokemon.pokemon_id,
										name, 
										pokemon.individual_attack,
										pokemon.individual_defense,
										pokemon.individual_stamina,
										((pokemon.individual_attack + pokemon.individual_defense + pokemon.individual_stamina) / 45 * 100).toFixed(2),
										pokemon.cp
									));
								}
							}

							formattedPokemon = formattedPokemon.sort((a, b) => {
								if(a.pokedex_num < b.pokedex_num) return -1;
								if(a.pokedex_num > b.pokedex_num) return 1;
								if(a.cp < b.cp) return -1;
								if(a.cp > b.cp) return 1;
								return 0;
							});

							expressUtils.sendResponse(res, next, 200, {pokemon: formattedPokemon}, req.body.username, endpoint);
						}, err => {
							log.error({err: err.message});
							expressUtils.sendResponse(res, next, 500, {error: props.errors.inventory}, req.body.username, endpoint)
						});
					});
				}, err => {
					log.error({err: err.message});
					expressUtils.sendResponse(res, next, 500, {error: props.errors.login}, req.body.username, endpoint);
				});
			}
		});
	}
}