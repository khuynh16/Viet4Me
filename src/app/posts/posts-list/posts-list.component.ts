import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { FiltersService } from 'src/app/home-page/filters/filters.service';
import { AuthService } from 'src/app/auth/auth.service';

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
  previousPostsPerPage = this.postsPerPage;
  pageSizeOptions = [1,2,5,10,20];
  isExpanded: boolean = false;
  userIsAuthenticated = false;
  userId: string;

  determineExpandOption: Subscription;
  determineLanguageOption: Subscription;
  determineFilterCategoriesOption: Subscription;
  determineFilterText: Subscription;
  authStatusSub: Subscription;
  getCategoryFiltersSub: Subscription;
  getUserTextFilterSub: Subscription;

  initialPosts: Post[];
  engTag: string;
  vietTag: string;
  categoryFilters: string[];

  userInputText: string;
  initialUserTextFilter: string;

  currentLanguage = 'ENG';

  constructor(public postsService: PostsService,
              public filtersService: FiltersService,
              public authService: AuthService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.initialUserTextFilter = '';
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
        this.initialPosts = postData.posts;
        // only posts that user creates are to be visible
        this.posts = this.posts.filter(post => post.creator === this.userId);
        // assigning category array to only categories visible by user
        this.posts.forEach(post => {
          post.categories.forEach(category => {
            if (!this.categoryFilters.includes(category)) {
              this.categoryFilters.push(category);
            }
          })
        });
        this.categoryFilters = this.categoryFilters.sort();
        // updates filter categories (and categories) observable (needed to display categories in filter)
        this.postsService.filterCategoriesUpdated.next([...this.categoryFilters]);
        this.postsService.categoriesUpdated.next([...this.categoryFilters]);
      });

    // action from radio buttons component where user can choose to expand or collapse posts
    this.determineExpandOption = this.filtersService.getExpandStatus()
    .subscribe((e)=>{
      this.toggleExpand();
    });

    // action from radio buttons component where user can switch main card language on top (eng or viet)
    this.determineLanguageOption = this.filtersService.getLangStatus()
      .subscribe(() => {
        this.switchLanguage(this.initialPosts);
    });

    // access current filtered categories to utilized in method below
    this.getCategoryFiltersSub = this.postsService.getFilterCategoryUpdateListener().subscribe(filteredCategories => {
      this.categoryFilters = filteredCategories;
    });

    // action from categories component where user can filter posts by categories
    this.determineFilterCategoriesOption = this.filtersService.getFilterCategoriesStatus()
      .subscribe((stuff) => {
        this.onClickCategoryFilters(this.categoryFilters);
    });

    // passes user's typed filter text to variable (used in the next method)
    this.getUserTextFilterSub = this.filtersService.getFilterUserInputListener().subscribe(text => {
      this.userInputText = text;
    })

    // calls postsService function whenever the text filter updates (for every letter or clear)
    this.determineFilterText = this.filtersService.getFilterTextStatus()
      .subscribe((text) => {
        this.onEnteredTextFilter(this.userInputText);
      });

    // initialize authenticity
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  /*
  * Gets posts associated with user text in search bar.
  * @param currentTextFilter the user text in search bar
  * @return call to postsService function to return filtered posts
  */
  onEnteredTextFilter(currentTextFilter) {
    this.postsService.getFilteredPosts(this.postsPerPage, this.currentPage, currentTextFilter, this.categoryFilters, this.currentLanguage);
  }

  /*
  * Gets posts to re-create post list with the currently selected filters.
  * @param filteredCategories categories associated with selected categories
  * @return postsService function call that returns filtered posts
  */
  onClickCategoryFilters(filteredCategories: string[]) {
    this.postsService.getFilteredPosts(this.postsPerPage, this.currentPage, this.userInputText, filteredCategories, this.currentLanguage);
  }

  /*
  * Change pagination details and get posts again.
  * @param pageData object holding data about current page
  */
  // onChangedPage(pageData: PageEvent) {
  //   // show loading spinner when fetching posts
  //     this.previousPostsPerPage = this.postsPerPage;
  //     this.currentPage = pageData.pageIndex + 1;
  //     this.postsPerPage = pageData.pageSize;
  //     console.log('Total posts: ' + this.totalPosts);
  //     console.log('posts per page: ' + this.postsPerPage);
  //     console.log('currentPage: ' + this.currentPage);
  //     console.log('previous posts per page: ' + this.previousPostsPerPage);
  //       if (this.totalPosts > this.postsPerPage || this.totalPosts > this.previousPostsPerPage) {
  //       this.isLoading = true;
  //       this.postsService.getPosts(this.postsPerPage, this.currentPage);
  //       // this.postsService.getFilteredPosts(this.postsPerPage, this.currentPage, this.userInputText, this.categoryFilters, this.currentLanguage);
  //     }


  //     // this.postsService.getFilteredPosts(this.postsPerPage, this.currentPage, this.categoryFilters);
  //     //this.postsService.getPosts(this.postsPerPage, this.currentPage);
  //   // this.postsService.getFilteredPosts(this.postsPerPage, this.currentPage, this.categoryFilters);
  // }

  /*
  * Delete post.
  * @param postId the id of the current post to be deleted
  * @return remaining posts (after deletion of current post)
  */
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

  /*
  * Switches language that is on the mat expansion header (vs the expansion body).
  * @param posts the current posts of user
  * @return posts with either language on top (and the other inside each expansion panel)
  */
  switchLanguage(posts: Post[]) {
    let tempString: string;
    // assign the opposite language (to be switched to)
    if (this.currentLanguage === 'ENG') {
      this.currentLanguage = 'VIET';
    } else {
      this.currentLanguage = 'ENG';
    }
    // exchange the string translation values with one another
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
    // call to retrieve posts
    // needed in the case when there is user types input to filter by and switches language
    this.postsService.getFilteredPosts(this.postsPerPage, this.currentPage, this.userInputText, this.categoryFilters, this.currentLanguage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.determineExpandOption.unsubscribe();
    this.determineLanguageOption.unsubscribe();
    this.determineFilterCategoriesOption.unsubscribe();
    this.getCategoryFiltersSub.unsubscribe();
    this.getUserTextFilterSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}


