import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserLogin } from '../models/user-login.model'

import { PokemonService } from '../services/pokemon.service'
import { PropertiesService } from '../services/properties.service';
import { UtilsService } from '../services/utils.service'

@Component({
	selector: 'login-form',
	templateUrl: './webapp/templates/login-form.component.html',
	styleUrls: ['./webapp/styles/login-form.component.css']
})

export class LoginFormComponent {
	private _model: UserLogin = new UserLogin("", "", this._properties.loginTypes[0]);
	private _loading: boolean = false;
	private _submitted: boolean = false;
	private _loginErrorMessage = null;

	constructor(private _pokemonService: PokemonService,
		private _properties: PropertiesService,
		private _utils: UtilsService) {}

	public get submitted(): boolean{
		return this._submitted;
	}

	private _changedLoginType(value: string){
		let loginTypes = this._properties.loginTypes.slice();
		loginTypes.splice(this._properties.loginTypes.indexOf(value), 1);
		loginTypes.unshift(value);
		this._utils.setLocalStorageObj('loginTypes', loginTypes);
	}

	private _onSubmit() {
		this._loading = true;
		this._loginErrorMessage = null;

		this._pokemonService.userLogin = this._model;

		this._pokemonService.retrievePokemon().then( () => {
			this._loading = false;
			this._submitted = true;
		}, err => {
			this._loading = false;
			this._loginErrorMessage = this._properties.loginErrorMessage;
		});
	}
}
