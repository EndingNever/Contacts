import { ContactsComponent } from './contacts/contacts.component';
import { AuthContactsComponent } from './auth-contacts/auth-contacts.component';

import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch:'full', component: LoginComponent},
  // { path: 'login', pathMatch:'full', component: LoginComponent },
  { path: 'contacts', pathMatch:'full', component: AuthContactsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
