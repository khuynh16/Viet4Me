import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PostsService } from 'src/app/posts/posts.service';
import { CategoryFilter } from './category-filter.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  constructor(public postsService: PostsService) { }

  private categoriesSub: Subscription;
  allComplete: boolean = true;
  currentCategories: CategoryFilter[] = [];
  categoryFilter: CategoryFilter = {
    name: 'Categories',
    completed: true,
    color: 'primary',
    categories: this.currentCategories
  }

  ngOnInit(): void {

    this.postsService.getCategories();
    this.categoriesSub = this.postsService.getCategoryUpdateListener()
      .subscribe((categories: string[]) => {
        categories.forEach(category => {{
          this.currentCategories.push({
            name: category,
            completed: true,
            color: 'primary'
          })
        }})
      });
  }

  updateAllComplete(categoryData: CategoryFilter) {
    this.allComplete = this.categoryFilter.categories != null && this.categoryFilter.categories.every(t => t.completed);
    console.log('clicked!');
    console.log(categoryData);
    console.log(categoryData.name + ' checked is now ' + categoryData.completed);


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
