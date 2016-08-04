import { ViewChild, Component } from '@angular/core';

import { PropertiesService } from '../services/properties.service'

import { LoginFormComponent } from './login-form.component'

declare let gapi: any;

@Component({
  selector: 'login',
  templateUrl: './webapp/templates/login.component.html' ,
  styleUrls: ['./webapp/styles/login.component.css'],
  directives: [LoginFormComponent]
})

export class LoginComponent { 
	private _title : string = this._properties.loginComponentTitle;
	private _content : string = this._properties.loginComponentContent;

	@ViewChild(LoginFormComponent) loginForm: LoginFormComponent;

	constructor(private _properties: PropertiesService) { }
}