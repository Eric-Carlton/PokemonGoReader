import { Component } from '@angular/core';

import { PropertiesService } from '../services/properties.service'
import { PokemonService } from '../services/pokemon.service'

import { Species } from '../models/species.model'

@Component({
  selector: 'pokemon-species',
  templateUrl: './webapp/templates/pokemon-species.component.html',
  styleUrls: ['./webapp/styles/pokemon-species.component.css']
})

export class PokemonSpeciesComponent {
  private _species: Species[] = [];

  constructor(private _properties: PropertiesService, private _pokemonService: PokemonService) {
  }

  public set species(species: Species[]){
    this._species = species;
  }
}
