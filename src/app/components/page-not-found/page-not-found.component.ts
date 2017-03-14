import {Component} from '@angular/core';

/**
 * A trivial component showing a static "page not found" message.
 */
@Component({
  selector: 'app-home',
  template: `
    <div class="margin__top--m" style="font-size: 2em; color: #fff">
      <p>Page could not be found</p>
      <p><i class="fa fa-frown-o" aria-hidden="true"></i></p>
    </div>
  `

})
export class PageNotFoundComponent { }
