import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {AppComponent} from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ListComponent } from './pages/list/list.component';
import { EtudiantComponent } from './pages/etudiant/etudiant.component';

export const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
   {
    path: 'login',
    component: LoginComponent
  },

   {
    path: 'list',
    component: ListComponent
  },

   {
    path: 'etudiant/:login',
    component: EtudiantComponent
  }

];
