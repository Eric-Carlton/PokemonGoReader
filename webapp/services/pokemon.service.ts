import { Injectable, EventEmitter } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { UserLogin } from '../models/user-login.model'
import { Pokemon } from '../models/pokemon.model';

import { PropertiesService } from '../services/properties.service';


@Injectable()
export class PokemonService {
	private _pokemon : Pokemon[] = [];
	private _pokemonUrl: string = this._properties.apiHost + this._properties.getPokemonRoute;
	private _pokemonChange: EventEmitter<any> = new EventEmitter();

	constructor(private _http: Http, private _properties: PropertiesService) { }

	public get pokemon(): Pokemon[]{
		return this._pokemon
	}

	public get pokemonChange(): EventEmitter<any>{
		return this._pokemonChange;
	}

	public retrievePokemon (login: UserLogin) {
		let headers = new Headers({
			'Content-Type': 'application/json'});
		return this._http
		.post(this._pokemonUrl, JSON.stringify(login), {headers: headers})
		.toPromise()
		.then(res => {
			this._pokemon = res.json().pokemon as Pokemon[];

			this._pokemonChange.emit({message: 'Pokemon updated'});
		})
		.catch(this.handleError);
	}

	private handleError(error: any) {
		console.error('An error occurred', error);
		return Promise.reject(error.message || error);
	}
}