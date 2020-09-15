import { Component, OnInit } from '@angular/core';

import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-radio-display-btns',
  templateUrl: './radio-display-btns.component.html',
  styleUrls: ['./radio-display-btns.component.css']
})
export class RadioFilterBtnsComponent implements OnInit {

  constructor(public filterService: FiltersService) { }

  ngOnInit(): void {}

  /*
  * Handling the expansion of posts.
  * @return function call to a function in filters.service.ts
  */
  changeExpand(){
    this.filterService.changeExpandEvent();
  }

  /*
  * Handling the change of language on what languages appears on top (rather than expanding the post).
  * @param language the current language selected in the language filter
  * @return function call to a function in filters.service.ts
  */
  changeLang(language) {
    this.filterService.changeLangEvent(language);
  }
}
