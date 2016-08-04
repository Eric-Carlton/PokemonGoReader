import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserLogin } from '../models/user-login.model'
import { PokemonService } from '../services/pokemon.service'

@Component({
	selector: 'login-form',
	templateUrl: './webapp/templates/login-form.component.html',
	styleUrls: ['./webapp/styles/login-form.component.css']
})

export class LoginFormComponent {
	private _types: string[] = ['Google', 'PTC'];
	private _model: UserLogin = new UserLogin("", "", this._types[0]);
	private _loading: boolean = false;
	private _submitted: boolean = false;

	constructor(private _pokemonService: PokemonService) { }

	public get submitted(): boolean{
		return this._submitted;
	}

	private _onSubmit() { 
		this._loading = true;

		this._pokemonService.retrievePokemon(this._model).then( () => {
			this._loading = false;
			this._submitted = true;
		});
	}
}