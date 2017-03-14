import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportComponent } from './support.component';
import { SharedModule } from '../../shared.module';

export const routes: Routes = [
  { path: '', component: SupportComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],

  declarations: [
    SupportComponent
  ],

})

export class SupportModule { }
