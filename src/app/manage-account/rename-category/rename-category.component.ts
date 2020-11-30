import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { PostsService } from '../../posts/posts.service';

@Component({
  selector: 'app-rename-category',
  templateUrl: './rename-category.component.html',
  styleUrls: ['./rename-category.component.css']
})
export class RenameCategoryComponent implements OnInit, OnDestroy {
  categories: string[] = [];
  private categoriesSub: Subscription;
  value: string = '';
  
  constructor(public postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getCategories();
    this.categoriesSub = this.postsService.getCategoryUpdateListener()
      .subscribe((categories: string[]) => {
        this.categories = categories;
      });
  }

  /*
  * Destroy categories subscription when component isn't loaded.
  * @return unsubscribing from subscription
  */
  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }

}
