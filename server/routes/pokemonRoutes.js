"use strict";

const bunyan = require('bunyan');
const pogobuf = require('pogobuf');
const Long = require('long');

const props = require('../config/properties.js');
const expressUtils = require('../utils/expressUtils.js');
const pokemonUtils = require('../utils/pokemonUtils.js');

const Pokemon = require('../models/Pokemon.js');
const Species = require('../models/Species.js');

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
				const client = new pogobuf.Client();

				let login = null;

				if(req.body.type.toLowerCase() === 'google'){
					login = new pogobuf.GoogleLogin();
				} else {
					login = new pogobuf.PTCLogin();
				}

				login.login(req.body.username, req.body.password).then(token => {
					client.setAuthInfo(req.body.type.toLowerCase(), token);

					client.init().then(() => {
						client.getInventory(0).then(inventory => {
							if (!inventory.success){
								expressUtils.sendResponse(res, next, 500, {error: props.errors.inventory}, req.body.username, endpoint);
							}

							let splitInventory = pogobuf.Utils.splitInventory(inventory);

							let rawPokemon = splitInventory.pokemon;

							let formattedPokemon = [];

							let speciesMap = {};

							for(let i = 0; i < rawPokemon.length; i++){
								let pokemon = rawPokemon[i];

								let caught_time = new Long(
									pokemon.creation_time_ms.low,
									pokemon.creation_time_ms.high,
									pokemon.creation_time_ms.unsigned
								);

								if(pokemon.hasOwnProperty('is_egg') && !pokemon.is_egg){
									let id = pokemon.pokemon_id.toString();

									let species = {
										'pokedex_number': id,
										'species': props.pokemonNamesByDexNum[pokemon.pokemon_id.toString()],
										'count': 1,
										'candy': 0,
										'evolve_sort': 0,
										'evolve': []
									};

									if (id in speciesMap){
										speciesMap[id].count += 1;
									} else {
										let candy = pokemonUtils.getCandy(pokemon, splitInventory.candies);
										props.pokemonEvolutionByDexNum[id].forEach(function(descendant){
											let canEvolve = Math.trunc((candy - 1) / (descendant.cost - 1));
											if (canEvolve > 0){
												species.evolve_sort = Math.max(species.evolve_sort, canEvolve);
												species.evolve.push({'id': descendant.id, 'canEvolve': canEvolve});
											}
										});

										species.candy = candy;
										speciesMap[id] = species;
									}

									formattedPokemon.push(new Pokemon(
										pokemon.pokemon_id,
										pokemonUtils.getName(pokemon),
										props.pokemonNamesByDexNum[pokemon.pokemon_id.toString()],
										pokemon.individual_attack,
										pokemon.individual_defense,
										pokemon.individual_stamina,
										pokemon.stamina,
										pokemon.stamina_max,
										parseFloat(((pokemon.individual_attack + pokemon.individual_defense + pokemon.individual_stamina) / 45 * 100).toFixed(2)),
										pokemon.cp,
										pokemon.favorite === 1,
										props.pokemonNamesByDexNum[props.pokemonFamilyIdByPokedexNum[pokemon.pokemon_id]],
										pokemon.id,
										pokemon.move_1,
										pokemon.move_2,
										caught_time.toString(),
										pokemonUtils.getLevel(pokemon)
									));
								}
							}

							let formattedSpecies = [];
							Object.keys(speciesMap).forEach(function(speciesId) {
								formattedSpecies.push(new Species(
									speciesMap[speciesId].pokedex_number,
									speciesMap[speciesId].species,
									speciesMap[speciesId].count,
									speciesMap[speciesId].candy,
									speciesMap[speciesId].evolve_sort,
									speciesMap[speciesId].evolve
								));
							});

							expressUtils.sendResponse(res, next, 200, {pokemon: formattedPokemon, species: formattedSpecies}, req.body.username, endpoint);
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

		app.post(props.routes.root + props.routes.transfer, (req, res, next) => {
			const endpoint = props.routes.root + props.routes.transfer;
			log.debug(
				{username: req.body.username},
				'POST request to ' + endpoint);

			if(!req.body.hasOwnProperty('username')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.username}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('password')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.password}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('type')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.type}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('pokemon_id')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.pokemon_id}, req.body.username, endpoint);
			} else if (!req.body.pokemon_id.hasOwnProperty('high')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.invalid_pokemon_id}, req.body.username, endpoint);
			} else if (!req.body.pokemon_id.hasOwnProperty('low')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.invalid_pokemon_id}, req.body.username, endpoint);
			} else if (!req.body.pokemon_id.hasOwnProperty('unsigned')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.invalid_pokemon_id}, req.body.username, endpoint);
			}
			else {
				req.body.pokemon_id.high = Number(req.body.pokemon_id.high);
				req.body.pokemon_id.low = Number(req.body.pokemon_id.low);
				req.body.pokemon_id.unsigned = req.body.pokemon_id === "true";

				const client = new pogobuf.Client();

				let login = null;

				if(req.body.type.toLowerCase() === 'google'){
					login = new pogobuf.GoogleLogin();
				} else {
					login = new pogobuf.PTCLogin();
				}

				login.login(req.body.username, req.body.password).then(token => {
					client.setAuthInfo(req.body.type.toLowerCase(), token);

					client.init().then(() => {
						client.releasePokemon(req.body.pokemon_id).then(releaseResponse => {
							expressUtils.sendResponse(res, next, 200, {success: releaseResponse.result === 1}, req.body.username, endpoint);
						}, err => {
							log.error({err: err.message});
							expressUtils.sendResponse(res, next, 500, {error: props.errors.transfer}, req.body.username, endpoint);
						});
					});
				}, err => {
					log.error({err: err.message});
					expressUtils.sendResponse(res, next, 500, {error: props.errors.login}, req.body.username, endpoint);
				});
			}
		});

		app.post(props.routes.root + props.routes.rename, (req, res, next) => {
			const endpoint = props.routes.root + props.routes.rename;
			log.debug(
				{username: req.body.username},
				'POST request to ' + endpoint);

			if(!req.body.hasOwnProperty('username')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.username}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('password')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.password}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('type')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.type}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('pokemon_id')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.pokemon_id}, req.body.username, endpoint);
			} else if (!req.body.pokemon_id.hasOwnProperty('high')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.invalid_pokemon_id}, req.body.username, endpoint);
			} else if (!req.body.pokemon_id.hasOwnProperty('low')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.invalid_pokemon_id}, req.body.username, endpoint);
			} else if (!req.body.pokemon_id.hasOwnProperty('unsigned')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.invalid_pokemon_id}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('nickname')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.nickname}, req.body.username, endpoint);
			}
			else {
				req.body.pokemon_id.high = Number(req.body.pokemon_id.high);
				req.body.pokemon_id.low = Number(req.body.pokemon_id.low);
				req.body.pokemon_id.unsigned = req.body.pokemon_id === "true";

				const client = new pogobuf.Client();

				let login = null;

				if(req.body.type.toLowerCase() === 'google'){
					login = new pogobuf.GoogleLogin();
				} else {
					login = new pogobuf.PTCLogin();
				}

				login.login(req.body.username, req.body.password).then(token => {
					client.setAuthInfo(req.body.type.toLowerCase(), token);

					client.init().then(() => {
						client.nicknamePokemon(req.body.pokemon_id, req.body.nickname).then(nicknameResponse => {
							expressUtils.sendResponse(res, next, 200, {success: nicknameResponse.result === 1}, req.body.username, endpoint);
						}, err => {
							log.error({err: err.message});
							expressUtils.sendResponse(res, next, 500, {error: props.errors.transfer}, req.body.username, endpoint);
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
