import { Injectable } from '@angular/core'

import { PropertiesService } from './properties.service'
import { PokemonService } from '../services/pokemon.service'

import { Pokemon } from '../models/pokemon.model'
import { Species } from '../models/species.model'
import { Move } from '../models/move.model'
import { SortOrder } from '../models/sort-order.model'
import { SortType } from '../models/sort-type.model'
import { PokemonTableStat } from '../models/pokemon-table-stat.model'

@Injectable()
export class SortService {
	private _pokemonSortOrder: string = '';
	private _speciesSortOrder: string = '';

	constructor(
		private _properties: PropertiesService,
		private _pokemonService: PokemonService
	){}

	public get pokemonSortOrder(): string {
		return this._pokemonSortOrder;
	}

	public get speciesSortOrder(): string {
		return this._speciesSortOrder;
	}

	public get pokemonSortOrders(): string[] {
		let allSortOrders: string[] = Object.keys(this._properties.pokemonTableSortOrders);
		let pokemonSortOrders: string[] = [];

		for(let i: number = 0; i < allSortOrders.length; i++){
			let sortOrder: string = allSortOrders[i];
			if(!sortOrder.includes('species_')) pokemonSortOrders.push(sortOrder);
		}

		return pokemonSortOrders;
	}

	public get speciesSortOrders(): string[] {
		return Object.keys(this._properties.speciesSortOrders);
	}

	public sortPokemon(
		sortOrderName: string,
		reverseSortOrder: boolean
	) {
		if(this._properties.pokemonTableSortOrders.hasOwnProperty(sortOrderName)){
			let sortOrder = this._properties.pokemonTableSortOrders[sortOrderName].sort_types;

			//double clicking a heading should reverse the primary sort
			if(this._pokemonSortOrder === sortOrderName && reverseSortOrder){
				sortOrder[0].asc = !sortOrder[0].asc;
			}

			this._pokemonSortOrder = sortOrderName;

			this._pokemonService.pokemon.sort((a, b) => {
				for(let i: number = 0; i < sortOrder.length; i++){
					let sortType: SortType = sortOrder[i];

					//TODO: figure out a cleaner way of DPS sorting
					if(sortType.property === 'moves.fast.DPS'){
						let moveA: Move = null;
						let moveB: Move = null;

						for(let moveIdx: number = 0; moveIdx < a.moves.fast.length; moveIdx++){
							let move: Move = a.moves.fast[moveIdx];
							if(move.selected){
								moveA = move;
								break;
							}
						}

						for(let moveIdx: number = 0; moveIdx < b.moves.fast.length; moveIdx++){
							let move: Move = b.moves.fast[moveIdx];
							if(move.selected){
								moveB = move;
								break;
							}
						}

						if(moveA && moveB && moveA.DPS < moveB.DPS) return sortType.asc ? -1 : 1;
						if(moveA && moveB && moveA.DPS > moveB.DPS) return sortType.asc ? 1 : -1;
					} else if(sortType.property === 'moves.charged.DPS'){
						let moveA: Move = null;
						let moveB: Move = null;

						for(let moveIdx: number = 0; moveIdx < a.moves.charged.length; moveIdx++){
							let move: Move = a.moves.charged[moveIdx];
							if(move.selected){
								moveA = move;
								break;
							}
						}

						for(let moveIdx: number = 0; moveIdx < b.moves.charged.length; moveIdx++){
							let move: Move = b.moves.charged[moveIdx];
							if(move.selected){
								moveB = move;
								break;
							}
						}

						if(moveA && moveB && moveA.DPS < moveB.DPS) return sortType.asc ? -1 : 1;
						if(moveA && moveB && moveA.DPS > moveB.DPS) return sortType.asc ? 1 : -1;
					} else if(sortType.property === 'DPS') {
						let dpsA: number = 0;
						let dpsB: number = 0;

						for(let moveIdx: number = 0; moveIdx < a.moves.fast.length; moveIdx++){
							let move: Move = a.moves.fast[moveIdx];
							if(move.selected){
								dpsA += move.DPS;
								break;
							}
						}

						for(let moveIdx: number = 0; moveIdx < b.moves.fast.length; moveIdx++){
							let move: Move = b.moves.fast[moveIdx];
							if(move.selected){
								dpsB += move.DPS;
								break;
							}
						}

						for(let moveIdx: number = 0; moveIdx < a.moves.charged.length; moveIdx++){
							let move: Move = a.moves.charged[moveIdx];
							if(move.selected){
								dpsA += move.DPS;
								break;
							}
						}

						for(let moveIdx: number = 0; moveIdx < b.moves.charged.length; moveIdx++){
							let move: Move = b.moves.charged[moveIdx];
							if(move.selected){
								dpsB += move.DPS;
								break;
							}
						}

						if(dpsA < dpsB) return sortType.asc ? -1 : 1;
						if(dpsA > dpsB) return sortType.asc ? 1 : -1;
					} else if(sortType.property.includes('species_')){
						let propertySplit: string[] = sortType.property.split('_');
						let speciesProperty: string = propertySplit.length > 0 ? propertySplit[1] : '';

						let speciesA: Species = null;
						let speciesB: Species = null;

						for(let speciesIdx: number = 0; speciesIdx < this._pokemonService.species.length; speciesIdx++){
							let curSpecies = this._pokemonService.species[speciesIdx];

							if(a.pokedex_number === curSpecies.pokedex_number) speciesA = curSpecies;
							if(b.pokedex_number === curSpecies.pokedex_number) speciesB = curSpecies;

							if(speciesA !== null && speciesB !== null) break;
						}

						if(speciesA[speciesProperty] < speciesB[speciesProperty]) return sortType.asc ? -1 : 1;
						if(speciesA[speciesProperty] > speciesB[speciesProperty]) return sortType.asc ? 1 : -1;
					} else {
						if(a[sortType.property] < b[sortType.property]) return sortType.asc ? -1 : 1;
						if(a[sortType.property] > b[sortType.property]) return sortType.asc ? 1 : -1;
					}
				}
				return 0;
			});
		}
	}

	public sortSpecies(
		sortOrderName: string,
		reverseSortOrder: boolean
	) {
	  if(this._properties.speciesSortOrders.hasOwnProperty(sortOrderName)){
	    let sortOrder = this._properties.speciesSortOrders[sortOrderName].sort_types;

	    //double clicking a heading should reverse the primary sort
	    if(this._speciesSortOrder === sortOrderName && reverseSortOrder){
	      sortOrder[0].asc = !sortOrder[0].asc;
	    }

	    this._speciesSortOrder = sortOrderName;

	    this._pokemonService.species.sort((a, b) => {
	      for(let i: number = 0; i < sortOrder.length; i++){
	        let sortType: SortType = sortOrder[i];

	        if(a[sortType.property] < b[sortType.property]) return sortType.asc ? -1 : 1;
	        if(a[sortType.property] > b[sortType.property]) return sortType.asc ? 1 : -1;
	      }
	      return 0;
	    });
	  }
	}
}