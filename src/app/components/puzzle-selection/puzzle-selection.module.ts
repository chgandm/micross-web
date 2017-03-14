import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { PuzzleSelectionComponent } from './puzzle-selection.component';
import { PuzzleRankingComponent } from '../puzzle-ranking/puzzle-ranking.component';
import { PuzzleTimePipe } from '../../pipes/puzzle-time.pipe';

export const routes: Routes = [
  {path: '', component: PuzzleSelectionComponent},
  {path: 'ranking/:id/:size', component: PuzzleRankingComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],

  declarations: [
    PuzzleSelectionComponent,
    PuzzleRankingComponent,
    PuzzleTimePipe
  ]

})

export class PuzzleSelectionModule { }
