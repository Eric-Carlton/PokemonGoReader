import { Injectable } from '@angular/core';

import { UtilsService } from '../services/utils.service'
import { PokemonService } from '../services/pokemon.service'

import { Pokemon } from '../models/pokemon.model';
import { Move } from '../models/move.model';
import { Species } from '../models/species.model';
import { PokemonTableStat } from '../models/pokemon-table-stat.model'

@Injectable()
export class ExportService {
  constructor(
    private _utils: UtilsService,
    private _pokemonService: PokemonService
  ) {}

  private _processMoves(moves: Move[]) {
    for (let moveIdx = 0; moveIdx < moves.length; moveIdx++) {
      let move = moves[moveIdx];

      if (move.selected) {
        return move.name + ',' + move.DPS + ',' + move.type + ',' + move.givesStab;
      }
    }
  }

  public exportPokemon(stats: PokemonTableStat[]) {
    let output: string = '';

    //get the headers for the CSV
    stats.forEach((stat, idx) => {
      let prop = stat.property.toLowerCase();
      if (prop === 'fast_dps') {
        output += 'fast move name,fast move DPS,fast move type, fast move STAB';
      } else if(prop === 'charged_dps'){
        output += 'charge move name,charge move DPS,charge move type, charge move STAB';
      } else if(prop === 'total_dps'){
        output += 'total DPS'
      } else if(prop.includes('species_')){
        let splitProp = prop.split('_');
        if(splitProp.length >= 2) output += splitProp[1];
      } else {
        output += prop;
      }

      if(idx < stats.length - 1) output += ',';
    });

    output = output.replace(/(\_\w)/g, function(m) {
      return ' ' + m[1]
    });

    // get each Pokemon's values for the CSV
    this._pokemonService.pokemon.forEach((mon) => {
      let matchingSpecies: Species = null;
      this._pokemonService.species.forEach((curSpecies) => {
        if(curSpecies.pokedex_number === mon.pokedex_number){
          matchingSpecies = curSpecies;
          return;
        }
      });

      output += '\n';

      stats.forEach((stat, idx) => {
        let prop = stat.property.toLowerCase();
        if (prop.includes('_dps')) {
          let moveSplit: string[] = prop.split('_');
          let moveType: string = moveSplit.length >= 1 ? moveSplit[0] : '';

          if(moveType === 'total'){
            let dps = 0;

            mon.moves.old_fast.forEach((move) => {
              if(move.selected){
                dps += move.DPS;
                return;
              }
            });

            mon.moves.fast.forEach((move) => {
              if(move.selected){
                dps += move.DPS;
                return;
              }
            });

            mon.moves.old_charged.forEach((move) => {
              if(move.selected){
                dps += move.DPS;
                return;
              }
            });

            mon.moves.charged.forEach((move) => {
              if(move.selected){
                dps += move.DPS;
                return;
              }
            });

            output += dps.toFixed(2);
          } else {
            output += this._processMoves(mon.moves[moveType].concat(mon.moves['old_' + moveType]));
          }
        } else if(prop.includes('species_')){
          let splitProp = prop.split('_');
          output += matchingSpecies && splitProp.length >= 2 ? matchingSpecies[splitProp[1]] : 'N/A';
        } else if(prop === 'caught_time'){
          let date: Date = new Date(mon[prop]);

          output += date.getMonth()+1 + '/' + 
          date.getDate() + '/' +  
          date.getFullYear() + ' ' +
          this._utils.pad(date.getHours(), 2) + ':' + 
          this._utils.pad(date.getMinutes(), 2) + ':' + 
          this._utils.pad(date.getSeconds(), 2);
        } else {
          output += mon[prop];
        }

        if(idx < stats.length - 1) output += ',';
      });
    });

    return encodeURIComponent(output);
  }
}