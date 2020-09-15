import { Component, OnInit } from '@angular/core';
import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  value = "";

  constructor(public filterService: FiltersService) { }


  ngOnInit(): void {
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
}
