import { Component, OnDestroy } from '@angular/core';

import { PokemonService } from '../services/pokemon.service'
import { PropertiesService } from '../services/properties.service'

import { Pokemon } from '../models/pokemon.model'
import { Move } from '../models/move.model'
import { SortType } from '../models/sort-type.model'
import { PokemonTableStat } from '../models/pokemon-table-stat.model'

@Component({
	selector: 'pokemon-table',
	templateUrl: './webapp/templates/pokemon-table.component.html',
	styleUrls: ['./webapp/styles/pokemon-table.component.css']
})

export class PokemonTableComponent {
	private _pokemon: Pokemon[] = [];
	private _pokemonTableStats: PokemonTableStat[] = this._properties.pokemonTableStats;
	private _showTransferButton: boolean = this._properties.showTransferButton;
	//right now we're only allowing 1 transfer at a time, like God intended,
	//this may need to be updated later to allow for batch transfers
	private _transferringPokemonAtIndex: number = null;
	private _renamingPokemonAtIndex: number = null;
	private _currentSortOrderName: string = '';

	constructor(private _properties: PropertiesService, private _pokemonService: PokemonService) {
	}

	public set pokemon(pokemons: Pokemon[]){
		this._pokemon = pokemons;

		this._pokemon = this._pokemon.map(function (pokemon) {
			pokemon.attacks = {
			  fast: window['pokemon'][pokemon.pokedex_number].QuickMoves.map(function (moveNumber) {
					let move = window['moves'][moveNumber];
					return new Move(
						move.Type.toLowerCase(),
						pokemon.move_1 === moveNumber,
						move.DPS,
						move.Name
					);
				}),
				charged: window['pokemon'][pokemon.pokedex_number].CinematicMoves.map(function (moveNumber) {
					let move = window['moves'][moveNumber];
					return new Move(
						move.Type.toLowerCase(),
						pokemon.move_2 === moveNumber,
						move.DPS,
						move.Name
					);
				})
			};
			pokemon.type_1 = window['pokemon'][pokemon.pokedex_number].Type1.toLowerCase();
			pokemon.type_2 = window['pokemon'][pokemon.pokedex_number].Type2.toLowerCase();
			return pokemon;
		});

		if(this._currentSortOrderName === ''){
			this._sortPokemon(this._properties.defaultPokemonTableSortOrder, false);
		} else {
			this._sortPokemon(this._currentSortOrderName, false);
		}
	}

	private _typeof(property: any): string{
		return typeof property;
	}

	private _sortPokemon(sortOrderName: string, reverseSortOrder: boolean) {
		if(this._properties.pokemonTableSortOrders.hasOwnProperty(sortOrderName)){
			let sortOrder = this._properties.pokemonTableSortOrders[sortOrderName];

			//double clicking a heading should reverse the primary sort
			if(this._currentSortOrderName === sortOrderName && reverseSortOrder){
				sortOrder[0].asc = !sortOrder[0].asc;
			}

			this._currentSortOrderName = sortOrderName;

			this._pokemon = this._pokemon.sort((a, b) => {
				for(let i: number = 0; i < sortOrder.length; i++){
					if(a[sortOrder[i].property] < b[sortOrder[i].property]) return sortOrder[i].asc ? -1 : 1;
					if(a[sortOrder[i].property] > b[sortOrder[i].property]) return sortOrder[i].asc ? 1 : -1;
				}
				return 0;
			});
		}
	}

	private _getTransferButtonText(index: number): string{
		if(this._transferringPokemonAtIndex && this._transferringPokemonAtIndex === index){
			return 'Transferring...';
		}

		return 'Transfer';
	}

	private _transferPokemon(pokemon: Pokemon, index: number){
		this._transferringPokemonAtIndex = index;

		this._pokemonService.transferPokemon(pokemon).then(() => {
			this._transferringPokemonAtIndex = null;
			this._pokemonService.retrievePokemon();
		});
	}

	private _getRenameButtonText(index: number): string{
		if(this._renamingPokemonAtIndex && this._renamingPokemonAtIndex === index){
			return 'Renaming...';
		}

		return 'Rename';
	}

	private _renamePokemon(pokemon: Pokemon, index: number){
		let nickname = window['prompt']('Enter new nickname: ');

		if(nickname){
			if(nickname.length > 12){
				alert('Nicknames can be no longer than 12 characters. Sorry!');
			} else {
				this._renamingPokemonAtIndex = index;

				this._pokemonService.renamePokemon(pokemon, nickname).then(() => {
					this._renamingPokemonAtIndex = null;
					this._pokemonService.retrievePokemon();
				});
			}
		}
	}
}
