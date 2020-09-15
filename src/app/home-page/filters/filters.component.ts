import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  filterPanelOpenState = false;

  constructor() { }

  ngOnInit(): void {
    }


}
