import { Component } from '@angular/core';

import { PropertiesService } from '../services/properties.service'
import { PokemonService } from '../services/pokemon.service'
import { SortService } from '../services/sort.service'

import { SortType } from '../models/sort-type.model'
import { Species } from '../models/species.model'

import { SettingsComponent } from './settings.component'

import { PrependZerosPipe } from '../pipes/prepend-zeros.pipe'

@Component({
  selector: 'pokemon-species',
  templateUrl: './webapp/templates/pokemon-species.component.html',
  styleUrls: ['./webapp/styles/pokemon-species.component.css'],
  directives: [SettingsComponent],
  pipes: [PrependZerosPipe]
})

export class PokemonSpeciesComponent {
  constructor(
    private _properties: PropertiesService,
    private _pokemonService: PokemonService,
    private _sortService: SortService
  ) {}
}
