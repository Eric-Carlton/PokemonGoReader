import { Component } from '@angular/core';

import { PokemonService } from '../services/pokemon.service'
import { Pokemon } from '../models/pokemon.model'

@Component({
	selector: 'pokemon-table',
	templateUrl: './webapp/templates/pokemon-table.component.html',
	styleUrls: ['./webapp/styles/pokemon-table.component.css']
})

export class PokemonTableComponent {
	pokemonLoaded: boolean = false;
	pokemon: Pokemon[] = [];

	constructor(private pokemonService: PokemonService) { 
		this.pokemon = pokemonService.pokemon;
		this.pokemonLoaded = this.pokemonService.pokemon.length > 0 ? true : false;

		pokemonService.pokemonChange.subscribe(() => { 
			this.pokemon = pokemonService.pokemon;
			this.pokemonLoaded = this.pokemonService.pokemon.length > 0 ? true : false;
		});
	}

	onClick(event){
		console.log(this.pokemonService);
		this.pokemon = this.pokemonService.pokemon;
	}
}