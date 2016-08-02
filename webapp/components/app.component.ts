import { Component } from '@angular/core';

import { LoginComponent } from './login.component'
import { PokemonTableComponent } from './pokemon-table.component'

declare let gapi: any;

@Component({
  selector: 'app',
  templateUrl: './webapp/templates/app.component.html',
  directives: [LoginComponent, PokemonTableComponent]
})

export class AppComponent { 
}