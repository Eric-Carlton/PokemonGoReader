import { Injectable, EventEmitter } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { UserLogin } from '../models/user-login.model'
import { Pokemon } from '../models/pokemon.model';
import { Species } from '../models/species.model';

import { PropertiesService } from '../services/properties.service';


@Injectable()
export class PokemonService {
	private _pokemon : Pokemon[] = [];
	private _species: Species[] = [];
	private _pokemonUrl: string = this._properties.apiHost + this._properties.getPokemonRoute;
	private _transferUrl: string = this._properties.apiHost + this._properties.transferPokemonRoute;
	private _renameUrl: string = this._properties.apiHost + this._properties.renamePokemonRoute;
	private _pokemonChange: EventEmitter<any> = new EventEmitter();
	private _userLogin: UserLogin = null;

	constructor(private _http: Http, private _properties: PropertiesService) { }

	public get pokemon(): Pokemon[]{
		return this._pokemon
	}

	public get species(): Species[]{
		return this._species
	}

	public get pokemonChange(): EventEmitter<any>{
		return this._pokemonChange;
	}

	public set userLogin(userLogin: UserLogin){
		this._userLogin = userLogin;
	}

	public retrievePokemon () {
		let headers = new Headers({
			'Content-Type': 'application/json'});
		return this._http
		.post(this._pokemonUrl, JSON.stringify(this._userLogin), {headers: headers})
		.toPromise()
		.then(res => {
			let resBody = res.json();
			this._pokemon = resBody.pokemon as Pokemon[];
			this._species = resBody.species as Species[];

			this._pokemonChange.emit({message: 'Pokemon updated'});
		})
		.catch(this.handleError);
	}

	public transferPokemon(pokemon: Pokemon){
		let headers = new Headers({
			'Content-Type': 'application/json'});

		let request = {
			username: this._userLogin.username,
			password: this._userLogin.password,
			type: this._userLogin.type,
			pokemon_id: pokemon.id
		};

		return this._http
		.post(this._transferUrl, JSON.stringify(request), {headers: headers})
		.toPromise()
		.then(res => {
		})
		.catch(this.handleError);
	}

	public renamePokemon(pokemon: Pokemon, nickname: string){
		let headers = new Headers({
			'Content-Type': 'application/json'});

		let request = {
			username: this._userLogin.username,
			password: this._userLogin.password,
			type: this._userLogin.type,
			pokemon_id: pokemon.id,
			nickname: nickname
		};

		return this._http
		.post(this._renameUrl, JSON.stringify(request), {headers: headers})
		.toPromise()
		.then(res => {
		})
		.catch(this.handleError);
	}

	private handleError(error: any) {
		console.error('An error occurred', error);
		return Promise.reject(error.message || error);
	}
}
