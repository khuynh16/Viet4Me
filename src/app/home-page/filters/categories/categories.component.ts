import { Component, OnInit, OnDestroy } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { PostsService } from 'src/app/posts/posts.service';

export interface CategoryFilter {
  name: string;
  completed: boolean;
  color: ThemePalette;
  categories?: string[];
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  constructor(public postsService: PostsService) { }

  private categoriesSub: Subscription;
  categories: string[] = [];

  totalCategories = 0;
  categoriesPerPage = 5;
  currentPage = 1;


  categoryFilter: CategoryFilter = {
    name: 'Categories',
    completed: false,
    color: 'primary',
    categories: []
  };

  ngOnInit(): void {

    this.postsService.getCategories();
    this.categoriesSub = this.postsService.getCategoryUpdateListener()
      .subscribe((categories: string[]) => {
        this.categories = categories;
        console.log('in filter categories!: ' + this.categories);

        this.categoryFilter.categories = this.categories;
        this.totalCategories = categories.length;
      });
  }

  onChangedPage(pageData: PageEvent) {
    // this.currentPage = pageData.pageIndex + 1;
    // this.categoriesPerPage = pageData.pageSize;
    // this.postsService.getPosts(this.categoriesPerPage, this.currentPage);
  }

  /*
  * Destroy categories subscription when component isn't loaded.
  * @return unsubscribing from subscription
  */
  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}
