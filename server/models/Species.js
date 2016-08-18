"use strict";

class Species {
	constructor(
		pokedex_number,
		species,
		count,
		candy,
		evolve_sort,
		evolve,
		transfer,
		need
	)
	{
		this.pokedex_number = pokedex_number;
		this.species = species;
		this.count = count;
		this.candy = candy;
		this.evolve_sort = evolve_sort;
		this.evolve = evolve;
		this.transfer = transfer;
		this.need = need;
	}
}

module.exports = Species;
