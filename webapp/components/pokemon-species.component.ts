import { Component } from '@angular/core';

import { PropertiesService } from '../services/properties.service'
import { PokemonService } from '../services/pokemon.service'

import { SortType } from '../models/sort-type.model'
import { Species } from '../models/species.model'

@Component({
  selector: 'pokemon-species',
  templateUrl: './webapp/templates/pokemon-species.component.html',
  styleUrls: ['./webapp/styles/pokemon-species.component.css']
})

export class PokemonSpeciesComponent {
  private _species: Species[] = [];
  private _currentSortOrderName: string = '';
  private _needSentinel = Number.MAX_SAFE_INTEGER;

  constructor(private _properties: PropertiesService, private _pokemonService: PokemonService) {
  }

  public set species(species: Species[]){
    this._species = species;
    if(this._currentSortOrderName === ''){
      this._sortSpecies(this._properties.defaultSpeciesSortOrder, false);
    } else {
      this._sortSpecies(this._currentSortOrderName, false);
    }
  }

  private _getSortOrders(): string[]{
    return Object.keys(this._properties.speciesSortOrders);
  }

  private _sortSpecies(sortOrderName: string, reverseSortOrder: boolean) {
    if(this._properties.speciesSortOrders.hasOwnProperty(sortOrderName)){
      let sortOrder = this._properties.speciesSortOrders[sortOrderName].sort_types;

      //double clicking a heading should reverse the primary sort
      if(this._currentSortOrderName === sortOrderName && reverseSortOrder){
        sortOrder[0].asc = !sortOrder[0].asc;
      }

      this._currentSortOrderName = sortOrderName;

      this._species = this._species.sort((a, b) => {
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
