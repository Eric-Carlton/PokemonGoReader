import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserLogin } from '../models/user-login.model'

@Component({
	selector: 'login-form',
	templateUrl: './webapp/templates/login-form.component.html'
})

export class LoginFormComponent {
	types = ['Google', 'PTC'];

	model = new UserLogin("", "", this.types[0]);

	submitted = false;

	onSubmit() { 
		this.submitted = true; 
		console.log(this.model);
	}
}