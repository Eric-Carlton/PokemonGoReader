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
	types: string[] = ['Google', 'PTC'];

	constructor(private pokemonService: PokemonService) { }

	model: UserLogin = new UserLogin("", "", this.types[0]);

	loading: boolean = false;
	submitted: boolean = false;

	onSubmit() { 
		this.loading = true;

		this.pokemonService.retrievePokemon(this.model).then( () => {
			this.loading = false;
			this.submitted = true;
		});
	}
}