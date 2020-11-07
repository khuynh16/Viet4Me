import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PostsService } from 'src/app/posts/posts.service';
import { CategoryFilter } from './category-filter.model';
import { FiltersService } from '../filters.service';
import { _MAT_HINT } from '@angular/material/form-field';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  constructor(public postsService: PostsService, public filterService: FiltersService) { }

  private categoriesSub: Subscription;
  allComplete: boolean = true;
  currentCategories: CategoryFilter[] = [];
  categoryFilter: CategoryFilter = {
    name: 'Categories',
    completed: true,
    color: 'primary',
    categories: this.currentCategories
  }
  filterCategories: string[];

  ngOnInit(): void {
    this.filterCategories = [];
    this.categoriesSub = this.postsService.getFilterCategoryUpdateListener()
      .subscribe((categories: string[]) => {
        if (this.currentCategories.length === 0) {
          categories.forEach(category => {
            this.currentCategories.push({
              name: category,
              completed: true,
              color: 'primary'
            });
            // adding category name to filterCategories variable (to use for filtering)
            this.filterCategories.push(category);
          });
        }
      });
  }

  /*
  * Change filter category options when user clicks on any category checkbox.
  * @param categoryData the category object (name, completed:boolean, and color)
  * @return update to filter categories observable and call to filter.services.ts function
  */
  updateAllComplete(categoryData: CategoryFilter) {
    this.allComplete = this.categoryFilter.categories != null && this.categoryFilter.categories.every(t => t.completed);
    // update filter categories
    // remove / add category to filtered categories array
    if (this.filterCategories.includes(categoryData.name) && categoryData.completed === false) {
      this.filterCategories = this.filterCategories.filter(categoryName => categoryName !== categoryData.name);
    } else {
      this.filterCategories.push(categoryData.name);
    }
    this.filterCategories = this.filterCategories.sort();
    this.postsService.filterCategoriesUpdated.next([...this.filterCategories]);
    // updates backend to current selected category filter options
    this.filterService.changeFilterCategoriesEvent();
  }

  /*
  * Displays visual to main category checkbox depending on categories checked.
  * @return true if all are checked; false if not all are checked or there are no categories
  */
  someComplete(): boolean {
    if (this.categoryFilter.categories == null) {
      return false;
    }
    return this.categoryFilter.categories.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  /*
  * Checks all previous categories to checked or unchecked, depending on current setting.
  * @return all checkboxes marked checked if main box is unchecked, or unchecks all checkboxes if
  * main checkbox is previously checked
  */
  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.categoryFilter.categories == null) {
      return;
    }
      // loop through each categoryFilter.categories element and mark as either checked or not checked
      for (let category of this.categoryFilter.categories) {
        category.completed = completed;
      };

      // call to function to handle processing of all posts to be visible or hidden
      this.updateAllCategories(this.categoryFilter.categories);
  }

  /*
  * Display or hide all posts when clicking the main checkbox for categories in filter.
  * @param allCategories CategoryFilter.categories array that contains all post categories
  * @return subject.next call to update subject variables and a call to service function 
  *   to update filtered categories for viewing
  */
  updateAllCategories(allCategories) {
    if (this.allComplete === false) {
      this.postsService.filterCategoriesUpdated.next([]);
    }
    else {
      for (let category of allCategories) {
        if (!this.filterCategories.includes(category.name)) {
          this.filterCategories.push(category.name);
        }
      }
      this.postsService.filterCategoriesUpdated.next([...this.filterCategories]);
    }
    this.filterService.changeFilterCategoriesEvent();
  }

  /*
  * Destroy categories subscription when component isn't loaded.
  * @return unsubscribing from subscription
  */
  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}
