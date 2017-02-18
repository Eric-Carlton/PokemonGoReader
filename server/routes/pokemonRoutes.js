"use strict";

const bunyan = require('bunyan');
const pogobuf = require('pogobuf');

const props = require('../config/properties.js');
const expressUtils = require('../utils/expressUtils.js');
const pokemonUtils = require('../utils/pokemonUtils.js');
const pokemonData = require('../../data/pokemon.json');

const Credential = require('../models/Credential.js');
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
				let credential = new Credential(req.body.type, /* token */ null, req.body.username, req.body.password);
				pokemonUtils.getClient(credential).then(client => {
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

							if(Object.keys(pokemon).length > 0 && pokemon.hasOwnProperty('is_egg') && !pokemon.is_egg){
								let id = pokemon.pokemon_id.toString();

								let species = {
									'pokedex_number': pokemon.pokemon_id,
									'species': pokemonData[id].Name,
									'count': 1,
									'candy': 0,
									'evolve_sort': 0,
									'evolve': [],
									'transfer': 0,
									'need': 0
								};

								if (id in speciesMap){
									speciesMap[id].count += 1;
								} else {
									species.candy = pokemonUtils.getCandy(pokemon, splitInventory.candies);
									speciesMap[id] = species;
								}

								formattedPokemon.push(new Pokemon(
									pokemon.pokemon_id,
									pokemonUtils.getName(pokemon),
									pokemonData[pokemon.pokemon_id].Name,
									pokemon.individual_attack,
									pokemon.individual_defense,
									pokemon.individual_stamina,
									pokemon.stamina,
									pokemon.stamina_max,
									parseFloat(((pokemon.individual_attack + pokemon.individual_defense + pokemon.individual_stamina) / 45 * 100).toFixed(2)),
									pokemon.cp,
									pokemon.favorite === 1,
									pokemonData[pokemonData[pokemon.pokemon_id].FamilyId].Name,
									pokemon.id,
									pokemon.move_1,
									pokemon.move_2,
									pokemon.creation_time_ms,
									pokemonUtils.getLevel(pokemon)
								));
							}
						}

						let formattedSpecies = [];
						Object.keys(speciesMap).forEach(function(speciesId) {
							let species = speciesMap[speciesId];
							let family = [];

							if(pokemonData[speciesId].CandyToEvolve > 0) {
								let requiredCandy1 = pokemonData[speciesId].CandyToEvolve;
								pokemonData[speciesId].EvolutionIds.forEach(function(evolution1Id){
									family.push({
										id: evolution1Id.toString(),
										cost: requiredCandy1
									});

									let requiredCandy2 = requiredCandy1 + pokemonData[evolution1Id].CandyToEvolve;
									pokemonData[evolution1Id].EvolutionIds.forEach(function(evolution2Id){
										family.push({
											id: evolution2Id.toString(),
											cost: requiredCandy2
										});
									});
								});
							}

							let maxDesc = 0;
							family.forEach(function(descendant){
								let canEvolve = Math.trunc((species.candy - 1) / (descendant.cost - 1));
								if (canEvolve > 0){
									species.evolve_sort = Math.max(species.evolve_sort, canEvolve);
									species.evolve.push({'id': descendant.id, 'canEvolve': canEvolve});
								} else {
									if (maxDesc < descendant.cost){
										maxDesc = descendant.cost;
										species.need = Math.ceil((descendant.cost - species.candy) / 4);
									}
								}
							});

							if (species.evolve_sort > 0 && species.count > species.evolve_sort) {
								species.transfer = species.count - species.evolve_sort;
							}

							formattedSpecies.push(new Species(
								species.pokedex_number,
								species.species,
								species.count,
								species.candy,
								species.evolve_sort,
								species.evolve,
								species.transfer,
								species.need
							));
						});

						expressUtils.sendResponse(res, next, 200, {pokemon: formattedPokemon, species: formattedSpecies, token: client.options.authToken}, req.body.username, endpoint);
					}, err => {
						log.error({err: err.message});
						expressUtils.sendResponse(res, next, 500, {error: props.errors.inventory}, req.body.username, endpoint)
					});
				}, err => {
					log.error({err: err.message}, 'pokemonUtils.getClient() failed');
					expressUtils.sendResponse(res, next, 500, {error: props.errors.inventory}, req.body.username, endpoint);
				});
			}
		});

		app.post(props.routes.root + props.routes.transfer, (req, res, next) => {
			const endpoint = props.routes.root + props.routes.transfer;
			log.debug(
				{username: req.body.username},
				'POST request to ' + endpoint);

			if(!req.body.hasOwnProperty('token')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.token}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('username')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.password}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('password')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.password}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('type')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.type}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('id')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.pokemon_id}, req.body.username, endpoint);
			}
			else {
				let credential = new Credential(req.body.type, req.body.token, req.body.username, req.body.password);
				pokemonUtils.getClient(credential).then(client => {
					client.releasePokemon(req.body.id).then(releaseResponse => {
							expressUtils.sendResponse(res, next, 200, {success: releaseResponse.result === 1, token: client.authToken}, req.body.username, endpoint);
						}, err => {
							log.error({err: err.message}, 'client.releasePokemon() failed');
							expressUtils.sendResponse(res, next, 500, {error: props.errors.transfer}, req.body.username, endpoint);
						});
					}, err => {
					  log.error({err: err.message}, 'pokemonUtils.getClient() failed');
					  expressUtils.sendResponse(res, next, 500, {error: props.errors.login}, req.body.username, endpoint);
				});
			}
		});

		app.post(props.routes.root + props.routes.rename, (req, res, next) => {
			const endpoint = props.routes.root + props.routes.rename;
			log.debug(
				{username: req.body.username},
				'POST request to ' + endpoint);

			if(!req.body.hasOwnProperty('token')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.token}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('username')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.password}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('password')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.password}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('type')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.type}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('id')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.pokemon_id}, req.body.username, endpoint);
			}
			else {
				let credential = new Credential(req.body.type, req.body.token, req.body.username, req.body.password);
				pokemonUtils.getClient(credential).then(client => {
					client.nicknamePokemon(req.body.id, req.body.nickname).then(nicknameResponse => {
							expressUtils.sendResponse(res, next, 200, {success: nicknameResponse.result === 1, token: client.authToken}, req.body.username, endpoint);
						}, err => {
							log.error({err: err.message}, 'client.nicknamePokemon() failed');
							expressUtils.sendResponse(res, next, 500, {error: props.errors.transfer}, req.body.username, endpoint);
						});
					}, err => {
					  log.error({err: err.message}, 'pokemonUtils.getClient() failed');
					  expressUtils.sendResponse(res, next, 500, {error: props.errors.login}, req.body.username, endpoint);
				});
			}
		});

		app.post(props.routes.root + props.routes.favorite, (req, res,next) => {
			const endpoint = props.routes.root + props.routes.favorite;
			log.debug(
				{username: req.body.username},
				'POST request to ' + endpoint);

			if(!req.body.hasOwnProperty('token')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.token}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('username')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.password}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('password')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.password}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('type')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.type}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('id')) {
				expressUtils.sendResponse(res, next, 400, {error: props.errors.pokemon_id}, req.body.username, endpoint);
			} else if (!req.body.hasOwnProperty('favorite')){
				expressUtils.sendResponse(res, next, 400, {error: props.errors.req_favorite}, req.body.username, endpoint);
			}
			else {
				let credential = new Credential(req.body.type, req.body.token, req.body.username, req.body.password);
				pokemonUtils.getClient(credential).then(client => {
					client.setFavoritePokemon(req.body.id, req.body.favorite).then(favoriteResponse => {
							expressUtils.sendResponse(res, next, 200, {success: favoriteResponse.result === 1, token: client.authToken}, req.body.username, endpoint);
						}, err => {
							log.error({err: err.message}, 'client.setFavoritePokemon() failed');
							expressUtils.sendResponse(res, next, 500, {error: props.errors.favorite}, req.body.username, endpoint);
						});
					}, err => {
					  log.error({err: err.message}, 'pokemonUtils.getClient() failed');
					  expressUtils.sendResponse(res, next, 500, {error: props.errors.login}, req.body.username, endpoint);
				});
			}
		});
	}
}
