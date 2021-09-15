import { ContactsComponent } from './contacts/contacts.component';

import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch:'full', component: LoginComponent },
  { path: 'contacts', pathMatch:'full', component: ContactsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
