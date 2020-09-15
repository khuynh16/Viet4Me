import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-viet-characters',
  templateUrl: './viet-characters.component.html',
  styleUrls: ['./viet-characters.component.css']
})
export class VietCharactersComponent implements OnInit {
  vietLangFilterSelected = false;
  sub: Subscription;

  constructor(public filterService: FiltersService) { }

  ngOnInit(): void {
    // sets value to true or false depending if viet filter selected by user
    // reveals vietnamese characters to input to text filter if needed
    this.sub = this.filterService.getLangStatus().subscribe(language => {
      if (language === 'VIET') {
        this.vietLangFilterSelected = true;
      } else {
        this.vietLangFilterSelected = false;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
