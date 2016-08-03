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
	private title : string = this.properties.loginComponentTitle;
	private content : string = this.properties.logicComponentContent;
	@ViewChild(LoginFormComponent) loginForm: LoginFormComponent;

	constructor(private properties: PropertiesService) { }
}