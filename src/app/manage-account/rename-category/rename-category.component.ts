import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rename-category',
  templateUrl: './rename-category.component.html',
  styleUrls: ['./rename-category.component.css']
})
export class RenameCategoryComponent implements OnInit {
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers', 'Cats', 'Dogs', 'Birds', 'Fish', 'Elephants', 'Whales'];

  constructor() { }

  ngOnInit(): void {
  }

}
