import { Component, OnInit, OnDestroy } from '@angular/core';
import { FiltersService } from '../filters.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  value = "";
  sub: Subscription;

  constructor(public filterService: FiltersService) { }


  ngOnInit(): void {
    this.sub = this.filterService.getFilterUserInputListener().subscribe(text => {
      console.log('SUPE: ' + text);
      if (this.value !== 'undefined') {
        this.value = text;
      }
    })
  }

  onUpdateInput(userTypedInput) {
    console.log(userTypedInput);

    this.filterService.userTextFilterUpdated.next(userTypedInput);
    this.filterService.changeFilterTextEvent();
  }

  clearFunction() {
    this.value = '';
    this.onUpdateInput('');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
