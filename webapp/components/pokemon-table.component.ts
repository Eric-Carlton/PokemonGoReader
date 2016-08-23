import { ViewChild, Component } from '@angular/core';

import { PokemonService } from '../services/pokemon.service'
import { PropertiesService } from '../services/properties.service'
import { UtilsService } from '../services/utils.service'

import { Pokemon } from '../models/pokemon.model'
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
	//right now we're only allowing 1 transfer at a time, like God intended,
	//this may need to be updated later to allow for batch transfers
	private _transferringPokemonAtIndex: number = null;
	private _renamingPokemonAtIndex: number = null;
	private _currentSortOrderName: string = '';

	constructor(
		private _properties: PropertiesService, 
		private _pokemonService: PokemonService,
		private _utils: UtilsService
		) {}

	public set pokemon(pokemons: Pokemon[]){
		this._pokemon = pokemons;

		this._pokemon = this._pokemon.map(function (pokemon) {
			pokemon.move_type_1 = window['pokemon'][pokemon.pokedex_number].Type1.toLowerCase();
			pokemon.move_type_2 = window['pokemon'][pokemon.pokedex_number].Type2.toLowerCase();

			pokemon.moves = {
				fast: window['pokemon'][pokemon.pokedex_number].QuickMoves.map(function (moveNumber: string) {
					let move: any = window['moves'][moveNumber.toString()];
					
					let givesStab: boolean = false;
					let dps: number = move.DPS;

					if(move.Type.toLowerCase() === pokemon.move_type_1 || move.Type.toLowerCase() === pokemon.move_type_2){
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

					if(move.Type.toLowerCase() === pokemon.move_type_1 || move.Type.toLowerCase() === pokemon.move_type_2){
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

		this._transferringPokemonAtIndex = null;
		this._renamingPokemonAtIndex = null;
		if(this._currentSortOrderName === ''){
			this._sortPokemon(this._properties.defaultPokemonTableSortOrder, false);
		} else {
			this._sortPokemon(this._currentSortOrderName, false);
		}
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

		} else if(property === 'fast_dps'){
			let moves: Move[] = pokemon.moves.fast;

			for(let i: number = 0; i < moves.length; i++){
				let move: Move = moves[i];

				if(move.selected){
					return move.name + '\n' + move.DPS + ' DPS';
				}
			}
		} else if(property === 'charged_dps'){
			let moves: Move[] = pokemon.moves.charged;

			for(let i: number = 0; i < moves.length; i++){
				let move: Move = moves[i];

				if(move.selected){
					return move.name + '\n' + move.DPS + ' DPS';
				}
			}
		} else if(typeof pokemon[property] === 'boolean'){
			return pokemon[property] ? '✓' : '';
		} else {
			return pokemon[property]
		}
	}

	private _getSortOrders(): string[]{
		return Object.keys(this._properties.pokemonTableSortOrders);
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
		if(this._transferringPokemonAtIndex === index){
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
			this._transferringPokemonAtIndex = index;

			this._pokemonService.transferPokemon(pokemon).then(() => {
				this._pokemonService.retrievePokemon().then(() => {}, () => {
					alert('Pokemon retrieval failed');
				});
			}, () => {
				this._transferringPokemonAtIndex = null;
				alert('Transfer failed');
			});
		}
	}

	private _getRenameButtonText(index: number): string{
		if(this._renamingPokemonAtIndex === index){
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
				this._renamingPokemonAtIndex = index;

				this._pokemonService.renamePokemon(pokemon, nickname).then(() => {
					this._pokemonService.retrievePokemon().then(() => {}, () => {
						alert('Pokemon retrieval failed');
					});
				}, () => {
					this._renamingPokemonAtIndex = null;
					alert('Renaming failed');
				});
			}
		}
	}
}
