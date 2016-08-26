import { ViewChild, Component } from '@angular/core';

import { PokemonService } from '../services/pokemon.service'
import { PropertiesService } from '../services/properties.service'
import { UtilsService } from '../services/utils.service'
import { ExportService } from '../services/export.service'

import { Pokemon } from '../models/pokemon.model'
import { Species } from '../models/species.model'
import { Move } from '../models/move.model'
import { SortOrder } from '../models/sort-order.model'
import { SortType } from '../models/sort-type.model'
import { PokemonTableStat } from '../models/pokemon-table-stat.model'

import { SettingsComponent } from './settings.component'

@Component({
	selector: 'pokemon-table',
	templateUrl: './webapp/templates/pokemon-table.component.html',
	styleUrls: ['./webapp/styles/pokemon-table.component.css'],
	directives: [SettingsComponent]
})

export class PokemonTableComponent {
	@ViewChild(SettingsComponent) settings: SettingsComponent;

	private _pokemon: Pokemon[] = [];
	private _operatingOnPokemonAtIndex: number = null;
	private _operationName: string = null;
	private _currentSortOrderName: string = '';
	private _retrieving = false;

	constructor(
		private _properties: PropertiesService, 
		private _pokemonService: PokemonService,
		private _utils: UtilsService,
		private _exportService: ExportService
	) {}

	public set pokemon(pokemons: Pokemon[]){
		this._pokemon = pokemons;

		this._pokemon = this._pokemon.map(function (pokemon) {
			pokemon.type_1 = window['pokemon'][pokemon.pokedex_number].Type1.toLowerCase();
			pokemon.type_2 = window['pokemon'][pokemon.pokedex_number].Type2.toLowerCase();

			pokemon.moves = {
				fast: window['pokemon'][pokemon.pokedex_number].QuickMoves.map(function (moveNumber: string) {
					let move: any = window['moves'][moveNumber.toString()];
					
					let givesStab: boolean = false;
					let dps: number = move.DPS;

					if(move.Type.toLowerCase() === pokemon.type_1 || move.Type.toLowerCase() === pokemon.type_2){
						givesStab = true;
						dps = Number((dps * 1.25).toFixed(2));
					}

					return new Move(
						move.Type.toLowerCase(),
						pokemon.move_1.toString() === moveNumber.toString(),
						dps,
						move.Name,
						givesStab
					);
				}),
				charged: window['pokemon'][pokemon.pokedex_number].CinematicMoves.map(function (moveNumber: string) {
					let move: any = window['moves'][moveNumber.toString()];

					let givesStab: boolean = false;
					let dps: number = move.DPS;

					if(move.Type.toLowerCase() === pokemon.type_1 || move.Type.toLowerCase() === pokemon.type_2){
						givesStab = true;
						dps = Number((dps * 1.25).toFixed(2));
					}

					return new Move(
						move.Type.toLowerCase(),
						pokemon.move_2.toString() === moveNumber.toString(),
						dps,
						move.Name,
						givesStab
					);
				})
			};

			pokemon.moves.fast = pokemon.moves.fast.sort((a,b) => {
				if ( a.DPS < b.DPS ) return 1;
				if ( a.DPS > b.DPS) return -1;
				return 0;
			});

			pokemon.moves.charged = pokemon.moves.charged.sort((a,b) => {
				if ( a.DPS < b.DPS ) return 1;
				if ( a.DPS > b.DPS) return -1;
				return 0;
			});

			return pokemon;
		});

		if(this._currentSortOrderName === ''){
			this._sortPokemon(this._properties.defaultPokemonTableSortOrder, false);
		} else {
			this._sortPokemon(this._currentSortOrderName, false);
		}

		this._operatingOnPokemonAtIndex = null;
		this._operationName = null;
		this._retrieving = false;
	}

	public export() {
		let link = <HTMLAnchorElement>document.getElementById('csvDownloadLink');
		let now = new Date();
		link.setAttribute('download', 'pokemon.' + now.getTime() + '.csv');
		link.href = 'data:text/plain;charset=utf-8,' + this._exportService.exportPokemon(this._pokemon);
	}

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

				for(let i: number = 0; i < pokemon.moves.fast.length; i++){
					let move: Move = pokemon.moves.fast[i];

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

				return dps.toString();
			} else {
				let moves: Move[] = pokemon.moves[moveType];
				
				for(let i: number = 0; i < moves.length; i++){
					let move: Move = moves[i];

					if(move.selected){
						return 'DPS: ' + move.DPS + '\n' +
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

	private _getSortOrders(): string[]{
		let allSortOrders: string[] = Object.keys(this._properties.pokemonTableSortOrders);
		let pokemonSortOrders: string[] = [];

		for(let i: number = 0; i < allSortOrders.length; i++){
			let sortOrder: string = allSortOrders[i];
			if(!sortOrder.includes('species_')) pokemonSortOrders.push(sortOrder);
		}

		return pokemonSortOrders;
	}

	private _sortPokemon(sortOrderName: string, reverseSortOrder: boolean) {
		if(this._properties.pokemonTableSortOrders.hasOwnProperty(sortOrderName)){
			let sortOrder = this._properties.pokemonTableSortOrders[sortOrderName].sort_types;

			//double clicking a heading should reverse the primary sort
			if(this._currentSortOrderName === sortOrderName && reverseSortOrder){
				sortOrder[0].asc = !sortOrder[0].asc;
			}

			this._currentSortOrderName = sortOrderName;

			this._pokemon = this._pokemon.sort((a, b) => {
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
						let species: Species[] = this._pokemonService.species;

						let speciesA: Species = null;
						let speciesB: Species = null;

						for(let speciesIdx: number = 0; speciesIdx < species.length; speciesIdx++){
							let curSpecies = species[speciesIdx];

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
				this._pokemonService.retrievePokemon().then(() => {}, this._handleError);
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
					this._pokemonService.retrievePokemon().then(() => {}, this._handleError);
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
			this._pokemonService.retrievePokemon().then(() => {}, this._handleError);
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
}
