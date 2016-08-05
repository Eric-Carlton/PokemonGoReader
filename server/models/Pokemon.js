"use strict";

class Pokemon {
	constructor(
		pokedex_number, 
		name, 
		species,
		attack_iv, 
		defense_iv, 
		stamina_iv, 
		max_hp,
		iv_percentage, 
		cp, 
		favorite, 
		candy, 
		family_name,
		id
	)
	{ 
		this.pokedex_number = pokedex_number;
		this.name = name;
		this.species = species;
		this.attack_iv = attack_iv;
		this.defense_iv = defense_iv;
		this.stamina_iv = stamina_iv;
		this.max_hp = max_hp;
		this.iv_percentage = iv_percentage;
		this.cp = cp;
		this.favorite = favorite;
		this.candy = candy;
		this.family_name = family_name;
		this.id = id;
	}
}

module.exports = Pokemon;