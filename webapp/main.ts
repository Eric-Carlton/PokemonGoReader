import { bootstrap }    from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { disableDeprecatedForms, provideForms } from '@angular/forms';


import { AppComponent } from './components/app.component';

import { PokemonService } from './services/pokemon.service'
import { PropertiesService } from './services/properties.service'
import { UtilsService } from './services/utils.service'

bootstrap(AppComponent, [
  disableDeprecatedForms(),
  provideForms(),
  HTTP_PROVIDERS, 
  PokemonService,
  PropertiesService,
  UtilsService
 ])
 .catch((err: any) => console.error(err));