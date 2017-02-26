import { Component } from '@angular/core';

import { PropertiesService } from '../services/properties.service'
import { PokemonService } from '../services/pokemon.service'
import { SortService } from '../services/sort.service'
import { ExportService } from '../services/export.service'
import { SettingsService } from '../services/settings.service'

import { PokemonTableComponent } from './pokemon-table.component'
import { PokemonSpeciesComponent } from './pokemon-species.component'

@Component({
	selector: 'pokemon-stats',
	templateUrl: './webapp/templates/pokemon-stats.component.html',
	styleUrls: ['./webapp/styles/pokemon-stats.component.css'],
	directives: [PokemonTableComponent, PokemonSpeciesComponent]
})

export class PokemonStatsComponent {
	private _title: string = this._properties.pokemonStatsComponentTitle;
	private _content: string = this._properties.pokemonStatsComponentContent;
	private _refreshingPokemon: boolean = false;

	constructor(
		private _properties: PropertiesService, 
		private _pokemonService: PokemonService,
		private _exportService: ExportService,
		private _sortService: SortService,
		private _settingsService: SettingsService
	){}

	private _export() {
		let link = <HTMLAnchorElement>document.getElementById('csvDownloadLink');
		let now = new Date();
		link.setAttribute('download', 'pokemon.' + now.getTime() + '.csv');
		link.href = 'data:text/plain;charset=utf-8,' + this._exportService.exportPokemon(
			this._settingsService.pokemonTableStats
		);
	}

	private _refreshPokemon(){
		if(!this._refreshingPokemon){
			this._refreshingPokemon = true;
			this._pokemonService.retrievePokemon().then( () => {
				if(this._sortService.pokemonSortOrder === ''){
					this._sortService.sortPokemon(this._properties.defaultPokemonTableSortOrder, false);
					
				} else {
					this._sortService.sortPokemon(this._sortService.pokemonSortOrder, false);
				}

				if(this._sortService.speciesSortOrder === ''){
					this._sortService.sortSpecies(this._properties.defaultSpeciesSortOrder, false);
				} else {
					this._sortService.sortSpecies(this._sortService.speciesSortOrder, false);
				}

				this._refreshingPokemon = false;
			}, err => {
				this._refreshingPokemon = false;
				alert('An error occurred while refreshing Pokemon');
			});
		}
	}
}
