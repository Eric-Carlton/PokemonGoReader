"use strict";

class Pokemon {
	constructor(
		pokedex_number,
		name,
		species,
		attack_iv,
		defense_iv,
		stamina_iv,
		current_hp,
		max_hp,
		iv_percentage,
		cp,
		favorite,
		family_name,
		id,
		move_1,
		move_2,
		caught_time,
		level
	)
	{
		this.pokedex_number = pokedex_number;
		this.name = name;
		this.species = species;
		this.attack_iv = attack_iv;
		this.defense_iv = defense_iv;
		this.stamina_iv = stamina_iv;
		this.current_hp = current_hp;
		this.max_hp = max_hp;
		this.iv_percentage = iv_percentage;
		this.cp = cp;
		this.favorite = favorite;
		this.family_name = family_name;
		this.id = id;
		this.move_1 = move_1;
		this.move_2 = move_2;
		this.caught_time = caught_time;
		this.level = level;
	}
}

module.exports = Pokemon;
