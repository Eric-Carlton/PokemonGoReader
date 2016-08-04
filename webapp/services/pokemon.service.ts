import { Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { UserLogin } from '../models/user-login.model'
import { Pokemon } from '../models/pokemon.model';

import { PropertiesService } from '../services/properties.service';


@Injectable()
export class PokemonService {
	private _pokemon : Pokemon[] = [];
	private _pokemonUrl: string = this.properties.apiHost + this.properties.getPokemonRoute;

	pokemonChange: EventEmitter<any> = new EventEmitter();

	constructor(private http: Http, private properties: PropertiesService) { }

	public get pokemon(): Pokemon[]{
		return this._pokemon
	}

	public retrievePokemon (login: UserLogin) {
		let headers = new Headers({
			'Content-Type': 'application/json'});
		return this.http
		.post(this._pokemonUrl, JSON.stringify(login), {headers: headers})
		.toPromise()
		.then(res => {
			this._pokemon = res.json().pokemon as Pokemon[];

			this.pokemonChange.emit({message: 'Pokemon updated'});
		})
		.catch(this.handleError);
	}

	private handleError(error: any) {
		console.error('An error occurred', error);
		return Promise.reject(error.message || error);
	}
}