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
  private filterCategoriesUpdated = new Subject<string[]>();

  ngOnInit(): void {

    this.filterCategories = [];

    this.postsService.getCategories();
    this.categoriesSub = this.postsService.getCategoryUpdateListener()
      .subscribe((categories: string[]) => {
        categories.forEach(category => {
          this.currentCategories.push({
            name: category,
            completed: true,
            color: 'primary'
          });
          // adding category name to filterCategories variable (to use for filtering)
          this.filterCategories.push(category);
        });
      });
  }

  updateAllComplete(categoryData: CategoryFilter) {
    this.allComplete = this.categoryFilter.categories != null && this.categoryFilter.categories.every(t => t.completed);
    console.log('clicked!');
    console.log(categoryData);
    console.log(categoryData.name + ' checked is now ' + categoryData.completed);

    // update filter categories
    // remove / add category to filtered categories array
    if (this.filterCategories.includes(categoryData.name) && categoryData.completed === false) {
      this.filterCategories = this.filterCategories.filter(categoryName => categoryName !== categoryData.name);
    } else {
      this.filterCategories.push(categoryData.name);
    }

    // this.postsService.getFilterCategoryUpdateListener()
    // .subscribe((categories: string[]) => {

    //   this.filterCategories = categories;
    //   this.filterCategories = this.filterCategories.filter(category => { category !== categoryData.name });

    //   // update filter categories subscription
    //   this.postsService.filterCategoriesUpdated.next([...this.filterCategories]);

    // });

    console.log('filtered categories!: ' + this.filterCategories);
    this.postsService.filterCategoriesUpdated.next([...this.filterCategories]);

    this.filterService.changeFilterCategoriesEvent();



    // somehow pass category of selected categories and pass to posts-list component


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

  /*
  * Destroy categories subscription when component isn't loaded.
  * @return unsubscribing from subscription
  */
  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}
