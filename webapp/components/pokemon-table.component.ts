import { Component, OnDestroy } from '@angular/core';

import { PokemonService } from '../services/pokemon.service'
import { Pokemon } from '../models/pokemon.model'

@Component({
	selector: 'pokemon-table',
	templateUrl: './webapp/templates/pokemon-table.component.html',
	styleUrls: ['./webapp/styles/pokemon-table.component.css']
})

export class PokemonTableComponent implements OnDestroy {
	pokemonLoaded: boolean = false;
	pokemon: Pokemon[] = [];

	private _subscription: any = null;

	constructor(private pokemonService: PokemonService) { 
		this.pokemon = pokemonService.pokemon;
		this.pokemonLoaded = this.pokemonService.pokemon.length > 0 ? true : false;

		this._subscription = pokemonService.pokemonChange.subscribe(() => { 
			this.pokemon = pokemonService.pokemon;
			this.pokemonLoaded = this.pokemonService.pokemon.length > 0 ? true : false;
		});
	}

	ngOnDestroy() {
		this._subscription.unsubscribe();
	}
}