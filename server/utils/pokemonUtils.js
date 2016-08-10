"use strict";

const bunyan = require('bunyan');

const props = require('../config/properties.js');

const log = bunyan.createLogger({
	name: props.log.names.pokemonUtils,
	streams: [{
		level: props.log.levels.console,
		stream: process.stdout
	}]
})

module.exports = {
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

		return props.pokemonNamesByDexNum[pokemon.pokemon_id.toString()];
	},

	getCandy: (pokemon, candies) => {
		for(let j = 0; j < candies.length; j++){
			let candy = candies[j];

			if(candy.family_id.toString() === props.pokemonFamilyIdByPokedexNum[pokemon.pokemon_id.toString()]){
				return candy.candy;
			}
		}

		return 0;
	}
}