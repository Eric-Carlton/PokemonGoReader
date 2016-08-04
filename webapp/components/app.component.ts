import { Component } from '@angular/core';

import { LoginComponent } from './login.component'
import { PokemonStatsComponent } from './pokemon-stats.component'

declare let gapi: any;

@Component({
  selector: 'app',
  templateUrl: './webapp/templates/app.component.html',
  directives: [LoginComponent, PokemonStatsComponent]
})

export class AppComponent { 
}