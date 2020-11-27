import { Component, OnInit } from '@angular/core';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-rename-category',
  templateUrl: './rename-category.component.html',
  styleUrls: ['./rename-category.component.css']
})
export class RenameCategoryComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }

}
