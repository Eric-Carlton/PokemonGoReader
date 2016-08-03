import { Component, OnDestroy } from '@angular/core';

import { PokemonService } from '../services/pokemon.service'
import { PropertiesService } from '../services/properties.service'

import { Pokemon } from '../models/pokemon.model'
import {SortType } from '../models/sort-type.model'

@Component({
	selector: 'pokemon-table',
	templateUrl: './webapp/templates/pokemon-table.component.html',
	styleUrls: ['./webapp/styles/pokemon-table.component.css']
})

export class PokemonTableComponent implements OnDestroy {
	private title: string = this.properties.pokemonTableComponentTitle;
	private content: string = this.properties.pokemonTableComponentContent;

	pokemonLoaded: boolean = false;
	pokemon: Pokemon[] = [];

	private _subscription: any = null;

	nameSortOrder: SortType[] = [
		new SortType('name', true),
		new SortType('iv_percentage', false),
		new SortType('cp', false)
	];

	numSortOrder: SortType[] = [
		new SortType('pokedex_num', true),
		new SortType('iv_percentage', false),
		new SortType('cp', false)
	];

	candySortOrder: SortType[] = [
		new SortType('candy', false),
		new SortType('pokedex_num', true),
		new SortType('cp', false),
		new SortType('iv_percentage', false)
	];

	cpSortOrder: SortType[] = [
		new SortType('cp', false),
		new SortType('iv_percentage', false),
		new SortType('pokedex_num', true)
	];

	attackSortOrder: SortType[] = [
		new SortType('attack_iv', false),
		new SortType('iv_percentage', false),
		new SortType('pokedex_num', true)
	];

	defenseSortOrder: SortType[] = [
		new SortType('defense_iv', false),
		new SortType('iv_percentage', false),
		new SortType('stamina_iv', false),
		new SortType('pokedex_num', true)
	];

	staminaSortOrder: SortType[] = [
		new SortType('stamina_iv', false),
		new SortType('iv_percentage', false),
		new SortType('defense_iv', false),
		new SortType('pokedex_num', true)
	];

	percentageSortOrder: SortType[] = [
		new SortType('iv_percentage', false),
		new SortType('cp', false)
	];

	favoriteSortOrder: SortType[] = [
		new SortType('favorite', false),
		new SortType('iv_percentage', false),
		new SortType('pokedex_num', true)
	];

	constructor(private pokemonService: PokemonService, private properties: PropertiesService) { 
		this.pokemon = pokemonService.pokemon;
		this.pokemonLoaded = this.pokemonService.pokemon.length > 0 ? true : false;

		this._subscription = pokemonService.pokemonChange.subscribe(() => { 
			this.pokemon = pokemonService.pokemon;
			this.pokemonLoaded = this.pokemonService.pokemon.length > 0 ? true : false;
		});
	}

	sortPokemon(sortTypes: SortType[]) {
		this.pokemon = this.pokemon.sort((a, b) => {
			for(let i: number = 0; i < sortTypes.length; i++){
				if(a[sortTypes[i].property] < b[sortTypes[i].property]) return sortTypes[i].asc ? -1 : 1;
				if(a[sortTypes[i].property] > b[sortTypes[i].property]) return sortTypes[i].asc ? 1 : -1;	
			}
			return 0;
		});
	}

	ngOnDestroy() {
		this._subscription.unsubscribe();
	}
}