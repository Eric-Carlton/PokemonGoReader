import { Component } from '@angular/core';

import { PokemonService } from '../services/pokemon.service'
import { PropertiesService } from '../services/properties.service'
import { UtilsService } from '../services/utils.service'
import { SortService } from '../services/sort.service'
import { SettingsService } from '../services/settings.service' 

import { Pokemon } from '../models/pokemon.model'
import { Species } from '../models/species.model'
import { Move } from '../models/move.model'

import { SettingsComponent } from './settings.component'

import { PrependZerosPipe } from '../pipes/prepend-zeros.pipe'

@Component({
	selector: 'pokemon-table',
	templateUrl: './webapp/templates/pokemon-table.component.html',
	styleUrls: ['./webapp/styles/pokemon-table.component.css'],
	directives: [SettingsComponent],
	pipes: [PrependZerosPipe]
})

export class PokemonTableComponent {
	private _operatingOnPokemonAtIndex: number = null;
	private _operationName: string = null;
	private _retrieving = false;

	constructor(
		private _properties: PropertiesService,
		private _pokemonService: PokemonService,
		private _utils: UtilsService,
		private _sortService: SortService,
		private _settingsService: SettingsService
	) {}

	private _getTableOutput(pokemon: Pokemon, property: string): string{
		if(property === 'caught_time'){
			let date = new Date(Number(pokemon.caught_time));

			return date.getMonth()+1 + '/' +
			date.getDate() + '/' +
			date.getFullYear() + ' ' +
			this._utils.pad(date.getHours(), 2) + ':' +
			this._utils.pad(date.getMinutes(), 2) + ':' +
			this._utils.pad(date.getSeconds(), 2);

		} else if(property.includes('_dps')){
			let moveSplit: string[] = property.split('_');
			let moveType: string = moveSplit.length >= 1 ? moveSplit[0] : '';

			if(moveType.toLowerCase() === 'total'){
				let dps = 0;

				for(let i: number = 0; i < pokemon.moves.old_fast.length; i++){
					let move: Move = pokemon.moves.old_fast[i];

					if(move.selected){
						dps += move.DPS;
						break;
					}
				}

				for(let i: number = 0; i < pokemon.moves.fast.length; i++){
					let move: Move = pokemon.moves.fast[i];

					if(move.selected){
						dps += move.DPS;
						break;
					}
				}

				for(let i: number = 0; i < pokemon.moves.old_charged.length; i++){
					let move: Move = pokemon.moves.old_charged[i];

					if(move.selected){
						dps += move.DPS;
						break;
					}
				}

				for(let i: number = 0; i < pokemon.moves.charged.length; i++){
					let move: Move = pokemon.moves.charged[i];

					if(move.selected){
						dps += move.DPS;
						break;
					}
				}

				return dps.toFixed(2);
			} else {
				let moves: Move[] = pokemon.moves[moveType].concat(pokemon.moves['old_' + moveType]);

				for(let i: number = 0; i < moves.length; i++){
					let move: Move = moves[i];

					if(move.selected){
						return 'Name: ' + move.name + '\n' +
						'DPS: ' + move.DPS + '\n' +
						'Type: ' + move.type + '\n' +
						'STAB?: ' + move.givesStab;
					}
				}

				return '';
			}
		} else if(property.includes('species_')){
			let propertySplit: string[] = property.split('_');
			let speciesProperty: string = propertySplit.length >= 2 ? propertySplit[1] : '';
			let species: Species[] = this._pokemonService.species;

			for(let i: number = 0; i < species.length; i++){
				let curSpecies = species[i];

				if(curSpecies.pokedex_number === pokemon.pokedex_number){
					return curSpecies[speciesProperty] === undefined ? '' : curSpecies[speciesProperty];
				}
			}

			return '';
		} else if(typeof pokemon[property] === 'boolean'){
			return pokemon[property] ? '✓' : '';
		} else {
			return pokemon[property]
		}

	}

	private _getTransferButtonText(index: number): string{
		if(this._operatingOnPokemonAtIndex === index && this._operationName.toLowerCase() === 'transfer'){
			return 'Transferring...';
		}

		return 'Transfer';
	}

	private _transferPokemon(pokemon: Pokemon, index: number){
		let transfer = confirm('Are you sure that you want to transfer ' +
			pokemon.name + '?' +
			'\nCP: ' + pokemon.cp +
			'\nIV Percentage: ' + pokemon.iv_percentage + '%');

		if(transfer){
			this._operatingOnPokemonAtIndex = index;
			this._operationName = 'Transfer'

			this._pokemonService.transferPokemon(pokemon).then(() => {
				this._retrieving = true;
				this._pokemonService.retrievePokemon().then(this._retrievalComplete, this._handleError);
			}, this._handleError);
		}
	}

	private _getRenameButtonText(index: number): string{
		if(this._operatingOnPokemonAtIndex === index && this._operationName.toLowerCase() === 'rename'){
			return 'Renaming...';
		}

		return 'Rename';
	}

	private _renamePokemon(pokemon: Pokemon, index: number){
		let nickname = prompt('Enter new nickname: ');

		if(nickname){
			if(nickname.length > 12){
				alert('Nicknames can be no longer than 12 characters. Sorry!');
			} else {
				this._operatingOnPokemonAtIndex = index;
				this._operationName = 'Rename'

				this._pokemonService.renamePokemon(pokemon, nickname).then(() => {
					this._retrieving = true;
					this._pokemonService.retrievePokemon().then(this._retrievalComplete, this._handleError);
				}, this._handleError);
			}
		}
	}

	private _getFavoriteButtonText(index: number, isFavorite: boolean){
		if(this._operatingOnPokemonAtIndex === index && this._operationName.toLowerCase() === 'favorite'){
			return isFavorite ? 'Unfavoriting...' : 'Favoriting...';
		}

		return isFavorite ? 'Unfavorite' : 'Favorite';
	}

	private _toggleFavoritePokemon(pokemon: Pokemon, index: number) {
		this._operatingOnPokemonAtIndex = index;
		this._operationName = 'Favorite'

		this._pokemonService.toggleFavoritePokemon(pokemon).then(() => {
			this._retrieving = true;
			this._pokemonService.retrievePokemon().then(this._retrievalComplete, this._handleError);
		}, this._handleError);
	}

	private _handleError = () => {
		if(this._retrieving){
			alert('Retrieval failed. Try clicking the reload icon next to the "Pokemon Stats" heading to get updated Pokemon.');
		} else {
			alert(this._operationName + ' operation failed.');
		}
		this._operatingOnPokemonAtIndex = null;
		this._operationName = null;
	}

	private _retrievalComplete = () => {
		if(this._sortService.pokemonSortOrder === ''){
			this._sortService.sortPokemon(this._properties.defaultPokemonTableSortOrder, false);
		} else {
			this._sortService.sortPokemon(this._sortService.pokemonSortOrder, false);
		}

		this._operatingOnPokemonAtIndex = null;
		this._operationName = null;
		this._retrieving = false;
	}
}
