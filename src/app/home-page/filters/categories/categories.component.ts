import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

import { PostsService } from 'src/app/posts/posts.service';
import { CategoryFilter } from './category-filter.model';
import { FiltersService } from '../filters.service';

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
    console.log("HELLOSFSSDF");

    this.categoriesSub = this.postsService.getFilterCategoryUpdateListener()
      .subscribe((categories: string[]) => {

        if (this.currentCategories.length === 0) {
          console.log('stuff?: ' + categories);
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
    console.log('clicked!');
    console.log(categoryData);
    console.log(categoryData.name + ' checked is now ' + categoryData.completed);
    console.log('Current filter categories: ' + this.filterCategories);

    // update filter categories
    // remove / add category to filtered categories array
    if (this.filterCategories.includes(categoryData.name) && categoryData.completed === false) {
      this.filterCategories = this.filterCategories.filter(categoryName => categoryName !== categoryData.name);
    } else {
      this.filterCategories.push(categoryData.name);
    }

    console.log('filtered categories!: ' + this.filterCategories);
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
    this.categoryFilter.categories.forEach(t => t.completed = completed);
  }

  /*
  * Destroy categories subscription when component isn't loaded.
  * @return unsubscribing from subscription
  */
  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}
