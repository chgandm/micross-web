import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PuzzlePreviewComponent } from './components/puzzle-preview/puzzle-preview.component';

/**
 * The Micross Web Shared Module. As per the Angular Guidelines (and I paraphrase the following), it
 *
 * - should contain components, directives, and pipes that are used everywhere in the app.
 * - should consist entirely of declarations (most of which should be exported)
 * - may re-export other widget modules such as CommonModule, FormsModule and modules with the UI controls that you use most widely
 * - should not have providers for reasons explained earlier.
 *
 * More recommendations available here: https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#q-module-recommendations
 */
@NgModule({
  imports: [
    CommonModule
  ],

  declarations: [
    PuzzlePreviewComponent
  ],

  exports: [
    CommonModule,
    PuzzlePreviewComponent
  ]

})

export class SharedModule { }
