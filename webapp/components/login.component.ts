import { ViewChild, Component } from '@angular/core';
import { LoginFormComponent } from './login-form.component'

declare let gapi: any;

@Component({
  selector: 'login',
  templateUrl: './webapp/templates/login.component.html' ,
  styleUrls: ['./webapp/styles/login.component.css'],
  directives: [LoginFormComponent]
})

export class LoginComponent { 
	private title : string = 'Pokemon Go! Pokemon Retriever';
	private content : string = 'Why use an IV calculator when you can easily retrieve your Pokemon\'s exact data from Niantic? This easy-to-use tool allows you to do just that!';
	private @ViewChild(LoginFormComponent) loginForm : elementRef;
}