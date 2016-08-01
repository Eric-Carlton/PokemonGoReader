import { Component } from '@angular/core';
import { LoginComponent } from './login.component'

declare let gapi: any;

@Component({
  selector: 'app',
  templateUrl: './webapp/templates/app.component.html',
  directives: [LoginComponent]
})

export class AppComponent { 
}