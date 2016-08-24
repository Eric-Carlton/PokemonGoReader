import { Injectable } from '@angular/core';

import { Pokemon } from '../models/pokemon.model';
import { Move } from '../models/move.model';

@Injectable()
export class ExportService {
  private _keysHidden: string[] = ['move_1', 'move_2', 'id'];

  private _processMoves(moves: Move[]) {
    for (let moveIdx = 0; moveIdx < moves.length; moveIdx++) {
      let move = moves[moveIdx];

      if (move.selected) {
        return move.name + ',' + move.DPS + ',' + move.type;
      }
    }
  }

  public exportPokemon(pokemon: Pokemon[]) {
    let output = '';
    for (let keyIdx = 0; keyIdx < Object.keys(pokemon[0]).length; keyIdx++) {
      let key = Object.keys(pokemon[0])[keyIdx];
      if (key.toLowerCase() !== 'moves') {
        if (this._keysHidden.indexOf(key.toLowerCase()) <= -1) {
          keyIdx === Object.keys(pokemon[0]).length - 1 ? output += key : output += key + ',';
        }
      } else {
        keyIdx === Object.keys(pokemon[0]).length - 1 ? output += 'fast_move_name,fast_move_DPS,fast_move_type,charge_move_name,charge_move_DPS,charge_move_type' : output += 'fast_move_name,fast_move_DPS,fast_move_type,charge_move_name,charge_move_DPS,charge_move_type,';
      }
    }

    output = output.replace(/(\_\w)/g, function(m) {
      return ' ' + m[1]
    });

    for (let objIdx = 0; objIdx < pokemon.length; objIdx++) {
      output += '\n';
      let obj = pokemon[objIdx];
      let keys = Object.keys(obj);
      for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        let key = keys[keyIdx];
        if (key.toLowerCase() !== 'moves') {
          if (this._keysHidden.indexOf(key.toLowerCase()) <= -1) {
            keyIdx === keys.length - 1 ? output += obj[key] : output += obj[key] + ',';
          }
        } else {
          keyIdx === keys.length - 1 ? output += this._processMoves(obj[key].fast) + ',' + this._processMoves(obj[key].charged) : output += output += this._processMoves(obj[key].fast) + ',' + this._processMoves(obj[key].charged) + ',';
        }
      }
    }

    return encodeURIComponent(output);
  }
}