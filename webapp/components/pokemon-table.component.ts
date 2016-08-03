import { Component, OnDestroy } from '@angular/core';

import { PokemonService } from '../services/pokemon.service'
import { PropertiesService } from '../services/properties.service'

import { Pokemon } from '../models/pokemon.model'

@Component({
	selector: 'pokemon-table',
	templateUrl: './webapp/templates/pokemon-table.component.html',
	styleUrls: ['./webapp/styles/pokemon-table.component.css']
})

export class PokemonTableComponent implements OnDestroy {
	private title: string = properties.pokemonTableComponentTitle;
	private content: string = properties.pokemonTableComponentContent;

	pokemonLoaded: boolean = false;
	pokemon: Pokemon[] = [];

	private _subscription: any = null;

	constructor(private pokemonService: PokemonService, private properties: PropertiesService) { 
		this.pokemon = pokemonService.pokemon;
		this.pokemonLoaded = this.pokemonService.pokemon.length > 0 ? true : false;

		this._subscription = pokemonService.pokemonChange.subscribe(() => { 
			this.pokemon = pokemonService.pokemon;
			this.pokemonLoaded = this.pokemonService.pokemon.length > 0 ? true : false;
		});
	}

	sortPokemonAsc(primary, secondary) {
		this.pokemon = this.pokemon.sort((a, b) => {
			if(a[primary] < b[primary]) return -1;
			if(a[primary] > b[primary]) return 1;
			if(secondary  && a[secondary] < b[secondary]) return -1;
			if(secondary && a[secondary] > b[secondary]) return 1;
			return 0;
		});
	}

	sortPokemonDesc(primary, secondary) {
		this.pokemon = this.pokemon.sort((a, b) => {
			if(a[primary] < b[primary]) return 1;
			if(a[primary] > b[primary]) return -1;
			if(secondary  && a[secondary] < b[secondary]) return 1;
			if(secondary && a[secondary] > b[secondary]) return -1;
			return 0;
		});
	}

	ngOnDestroy() {
		this._subscription.unsubscribe();
	}
}