import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';

export interface CategoryFilter {
  name: string;
  completed: boolean;
  color: ThemePalette;
  categories?: CategoryFilter[];
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categoryFilter: CategoryFilter = {
    name: 'Categories',
    completed: false,
    color: 'primary',
    categories: [
      {name: 'Questions', completed: false, color: 'primary'},
      {name: 'Casual talk', completed: false, color: 'primary'},
      {name: 'Funny remarks about life and it is cool', completed: false, color: 'primary'},
      {name: 'Animals', completed: false, color: 'primary'}
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.categoryFilter.categories != null && this.categoryFilter.categories.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.categoryFilter.categories == null) {
      return false;
    }
    return this.categoryFilter.categories.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.categoryFilter.categories == null) {
      return;
    }
    this.categoryFilter.categories.forEach(t => t.completed = completed);
  }

}
