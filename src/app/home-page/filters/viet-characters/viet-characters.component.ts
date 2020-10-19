import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-viet-characters',
  templateUrl: './viet-characters.component.html',
  styleUrls: ['./viet-characters.component.css']
})
export class VietCharactersComponent implements OnInit, OnDestroy {
  vietLangFilterSelected = false;
  sub: Subscription;
  sub2: Subscription;
  currentUserFilterText: string;

  aFirstRow = ['á', 'à', 'ả', 'ã', 'ạ', 'ă'];
  aSecondRow = ['ắ', 'ằ', 'ẵ', 'ẳ', 'ặ', 'â'];
  aThirdRow = ['ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'];
  dFirstRow = ['đ'];
  dSecondRow = ['₫'];
  eFirstRow = ['é', 'è', 'ẻ', 'ẽ'];
  eSecondRow = ['ẹ', 'ê', 'ế', 'ề'];
  eThirdRow = ['ể', 'ễ', 'ệ'];
  iFirstRow = ['í', 'ì'];
  iSecondRow = ['ỉ', 'ĩ'];
  iThirdRow = ['ị'];
  oFirstRow = ['ó', 'ò', 'ò', 'õ', 'ọ', 'ô'];
  oSecondRow = ['ố', 'ồ', 'ổ', 'ỗ', 'ộ', 'ơ'];
  oThirdRow = ['ớ', 'ờ', 'ở', 'ỡ', 'ợ'];
  uFirstRow = ['ú', 'ù', 'ủ', 'ũ'];
  uSecondRow = ['ụ', 'ư', 'ứ', 'ừ'];
  uThirdRow = ['ử', 'ữ', 'ự'];
  yFirstRow = ['ý', 'ỳ'];
  ySecondRow = ['ỷ', 'ỹ'];
  yThirdRow = ['ỵ'];

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

    this.sub2 = this.filterService.getFilterUserInputListener().subscribe(text => {
      this.currentUserFilterText = text;
    })
  }

  insertIntoInput(letter) {
    // update subject with previous subject value + selected vietnamese character
    // if current subject value is undefined, update subject with just the character
    if (this.currentUserFilterText) {
      this.filterService.userTextFilterUpdated.next(this.currentUserFilterText + letter);
    } else {
      this.filterService.userTextFilterUpdated.next(letter);
    }

    this.filterService.changeFilterTextEvent();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

}
