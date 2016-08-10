import { ViewChild, Component, OnDestroy } from '@angular/core';

import { PropertiesService } from '../services/properties.service'
import { PokemonService } from '../services/pokemon.service'

import { PokemonTableComponent } from './pokemon-table.component'

@Component({
	selector: 'pokemon-stats',
	templateUrl: './webapp/templates/pokemon-stats.component.html',
	styleUrls: ['./webapp/styles/pokemon-stats.component.css'],
	directives: [PokemonTableComponent]
})

export class PokemonStatsComponent implements OnDestroy {
	private _title: string = this._properties.pokemonStatsComponentTitle;
	private _content: string = this._properties.pokemonStatsComponentContent;
	private _subscription: any = null;
	private _pokemonLoaded: boolean = false;
	private _refreshingPokemon: boolean = false;
	
	@ViewChild(PokemonTableComponent) pokemonTable: PokemonTableComponent;

	constructor(private _properties: PropertiesService, private _pokemonService: PokemonService){
		this._subscription = this._pokemonService.pokemonChange.subscribe(() => { 
			this._pokemonLoaded = this._pokemonService.pokemon.length > 0;
			this.pokemonTable.pokemon = this._pokemonService.pokemon;
		});
	}

	private _refreshPokemon(){
		if(!this._refreshingPokemon){
			this._refreshingPokemon = true;
			this._pokemonService.retrievePokemon().then( () => {
				this._refreshingPokemon = false;
			}, err => {
				this._refreshingPokemon = false;
				alert('An error occurred while refreshing Pokemon');
			});
		}
	}

	ngOnDestroy() {
		this._subscription.unsubscribe();
	}
}