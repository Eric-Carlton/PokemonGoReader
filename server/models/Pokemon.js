"use strict";

class Pokemon {
	constructor(pokedex_num, name, attack_iv, defense_iv, stamina_iv, iv_percentage, cp, favorite, candy){ 
		this.pokedex_num = pokedex_num;
		this.name = name;
		this.attack_iv = attack_iv;
		this.defense_iv = defense_iv;
		this.stamina_iv = stamina_iv;
		this.iv_percentage = iv_percentage;
		this.cp = cp;
		this.favorite = favorite;
		this.candy = candy;
	}
}

module.exports = Pokemon;