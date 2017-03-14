import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { EmailValidatorDirective } from '../../directives/email-validator.directive';

export const routes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ],

  declarations: [
    LoginComponent,
    EmailValidatorDirective
  ],

})

export class LoginModule { }
