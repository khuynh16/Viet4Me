import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { FiltersService } from 'src/app/home-page/filters/filters.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;
  totalPosts = 0;
  postsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10,20];
  isExpanded: boolean = false;

  determineExpandOption: Subscription;
  determineLanguageOption: Subscription;
  determineFilterCategoriesOption: Subscription;
  sub: Subscription;

  initialPosts: Post[];
  engTag: string;
  vietTag: string;
  categoryFilters: string[];

  constructor(public postsService: PostsService, public filtersService: FiltersService) {}

  ngOnInit() {
    this.categoryFilters = [];
    this.engTag = 'ENG';
    this.vietTag = 'VIET';
    this.isLoading = true;
    // trigger http request when post list is loaded
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        console.log('this is this.posts:');
        console.log(this.posts);

        this.posts.forEach(post => {
          post.categories.forEach(category => {
            if (!this.categoryFilters.includes(category)) {
              this.categoryFilters.push(category);
            }
          })
        })
        this.categoryFilters = this.categoryFilters.sort();
        console.log('this is categoryFilters: ' + this.categoryFilters);
        // updates filter categories observable (needed to display categories in filter)
        this.postsService.filterCategoriesUpdated.next([...this.categoryFilters]);
      });

    // action from radio buttons component where user can choose to expand or collapse posts
    this.determineExpandOption = this.filtersService.getExpandStatus()
    .subscribe((e)=>{
      this.toggleExpand();
    });

    // access current posts from observable to utilize in the next following method below
    this.postsSub = this.postsService.getPostUpdateListener().subscribe(postData => {
      this.initialPosts = postData.posts;
    })

    // action from radio buttons component where user can switch main card language on top (eng or viet)
    this.determineLanguageOption = this.filtersService.getLangStatus()
      .subscribe(() => {
        this.switchLanguage(this.initialPosts);
    });

    // access current filtered categories to utilized in method below
    this.sub = this.postsService.getFilterCategoryUpdateListener().subscribe(filteredCategories => {
      this.categoryFilters = filteredCategories;
    });

    // action from categories component where user can filter posts by categories (DOESN"T WORK ATM)
    this.determineFilterCategoriesOption = this.filtersService.getFilterCategoriesStatus()
      .subscribe((stuff) => {
        console.log("SUPERDUPER");
        this.onClickCategoryFilters(this.categoryFilters);
    });
  }

  /*
  * Gets posts to re-create post list with the currently selected filters (DOESN"T WORK ATM)
  */
  onClickCategoryFilters(filteredCategories: string[]) {
    console.log('this is filtered categories: ' + filteredCategories);
    // maybe call something like this.postsService.getFilteredPosts?
    this.postsService.getFilteredPosts(this.postsPerPage, this.currentPage, filteredCategories);
    // this.postsService.getCategories();
  }

  /*
  * Change pagination details and get posts again.
  * @param pageData object holding data about current page
  */
  onChangedPage(pageData: PageEvent) {
    // show loading spinner when fetching posts

    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    console.log('Total posts: ' + this.totalPosts);
    console.log('posts per page: ' + this.postsPerPage);
    console.log('currentPage: ' + this.currentPage);
       if (this.totalPosts > this.postsPerPage) {
      this.isLoading = true;

      // this.postsService.getPosts(this.postsPerPage, this.currentPage);
      this.postsService.getFilteredPosts(this.postsPerPage, this.currentPage, this.categoryFilters);
       }
    // this.postsService.getFilteredPosts(this.postsPerPage, this.currentPage, this.categoryFilters);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  /*
  * Expands or collapse posts based on filter option (closed or open) from filters service.
  * @return opposite value of isExpanded (true or false)
  */
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  switchLanguage(posts: Post[]) {
    let tempString;
    posts.forEach(post => {
      tempString = post.engTranslation;
      post.engTranslation = post.vietTranslation;
      post.vietTranslation = tempString;
    });

    // switch language symbols to ENG or VIET based on selected language filter option
    if (this.engTag === 'ENG') {
      this.engTag = 'VIET';
      this.vietTag = 'ENG';
    } else {
      this.engTag = 'ENG';
      this.vietTag = 'VIET';
    }
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.determineExpandOption.unsubscribe();
    this.determineLanguageOption.unsubscribe();
    this.determineFilterCategoriesOption.unsubscribe();
    this.sub.unsubscribe();
  }
}


