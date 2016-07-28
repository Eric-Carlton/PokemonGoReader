import { bootstrap }    from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { LoginComponent } from './components/login.component';

bootstrap(LoginComponent, [
  disableDeprecatedForms(),
  provideForms()
 ])
 .catch((err: any) => console.error(err));