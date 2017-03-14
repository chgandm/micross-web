import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePuzzleComponent } from './create-puzzle.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { EmbeddedAuthenticatedGuard } from '../../guards/embedded.authenticated.guard';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    component: CreatePuzzleComponent,
    canActivate: [EmbeddedAuthenticatedGuard, AuthenticatedGuard]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule
  ],

  declarations: [
    CreatePuzzleComponent
  ],

  providers: [
    EmbeddedAuthenticatedGuard,
    AuthenticatedGuard
  ]
})

export class CreatePuzzleModule { }
