import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { AuthService } from '../auth/auth.service';

import { environment } from '../../../src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PostsService  {
  private posts: Post[] = [];
  private categories: string[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  public categoriesUpdated = new Subject<string[]>();
  public filterCategoriesUpdated = new Subject<string[]>();
  filteredCategories: string[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  /*
  * Retrieve all posts from database.
  * @param postsPerPage number of posts to display initial via pagination (pagination not working atm)
  * @param currentPage first page of pagination (again, pagination not activate atm)
  * @return subject.next method call
  */
  getPosts(postsPerPage, currentPage) {
     const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // call to get method from backend
    this.http.get<{ message: string, posts: any, maxPosts: number }>(environment.apiUrl + '/posts' + queryParams)
      .pipe(map((postData) => {
        // changing ._id to id in posts object array
        return {
          posts: postData.posts.map(post => {
            return {
              id: post._id,
              engTranslation: post.engTranslation,
              vietTranslation: post.vietTranslation,
              categories: post.categories,
              creator: post.creator
            };
          }), maxPosts: postData.maxPosts
        };
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  /*
  * Retrieved filtered posts (posts with certain filters utilized by user)
  * @param postsPerPage number of posts via pagination
  * @param currentPage first page of pagination
  * @param userInputedFilter user search bar filter value
  * @param filteredCategories all categories of filtered posts
  * @param currentLanguage language (eng if filter not activated, viet if filter activated)
  */
  getFilteredPosts(postsPerPage, currentPage, userInputedFilter, filteredCategories: string[], currentLanguage) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}&userfilter=${userInputedFilter}&categoryfilter=${filteredCategories}&language=${currentLanguage}`;
    // call to get method from backend
    this.http.get<{ message: string, posts: any, maxPosts: number }>(environment.apiUrl + '/posts/categories' + queryParams)
      .pipe(map((postData) => {
        // changing ._id to id in posts object array
        return {
          posts: postData.posts.map(post => {
            if (currentLanguage === 'ENG') {
              return {
                id: post._id,
                engTranslation: post.engTranslation,
                vietTranslation: post.vietTranslation,
                categories: post.categories,
                creator: post.creator
              };
            } else if (currentLanguage === 'VIET') {
              return {
                id: post._id,
                engTranslation: post.vietTranslation,
                vietTranslation: post.engTranslation,
                categories: post.categories,
                creator: post.creator
              };
            }
          }), maxPosts: postData.maxPosts
        };
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  /*
  * Returns all categories that have been included in user posts.
  * @return subject.next method call of categories
  */
  getCategories() {
    this.http.get<{ message: string, posts: any }>(environment.apiUrl + '/posts')
      .subscribe(postData => {
        // loops through all posts, and if the post's creator matches current user, loop through
        // post's categories array and update this.categories array with unique categories
        for (let i = 0; i < postData.posts.length; i++) {
          if (postData.posts[i].creator === this.authService.getUserId()) {
            for (let j = 0; j < postData.posts[i].categories.length; j++) {
              if (!this.categories.includes(postData.posts[i].categories[j])) {
                this.categories.push(postData.posts[i].categories[j]);
              }
            }
          }
        }
        // update observables
        this.categoriesUpdated.next([...this.categories]);
        this.filterCategoriesUpdated.next([...this.categories]);
      });
  }

  /*
  * Adds post to database.
  * @param engTranslation english content user wants to translate
  * @param vietTranslation the viet translation of engTranslation (to be done via Google Translate API)
  * @param categories array of categories that the post will be entered in
  * @return subject.next call of posts array (with newly added post)
  */
  addPost(engTranslation: string, vietTranslation: string, categories: string[], userId: string) {
    const post: Post = {
      id: null,
      engTranslation: engTranslation,
      vietTranslation: vietTranslation,
      categories: categories,
      creator: userId
    };
    this.http.post<{ message: string, postId: string }>(environment.apiUrl + "/posts", post)
      .subscribe(responseData => {
        this.router.navigate(['/main-page/home']);
      });
  }

  /*
  * Deletes post from database.
  * @param postId the individual id belonging to a post
  * @return subject.next call of posts array (with deleted post)
  */
  deletePost(postId: string) {
    return this.http.delete(environment.apiUrl + '/posts/' + postId);
  }

  /*
  * Updates/edits a post already in database.
  * @param id post id
  * @param engTranslation string of the english input to be translated
  * @param vietTranslation translation of engTranslation in vietnamese
  * @param categories array of categories that the post is in
  * @return a subject.next method call to update posts array
  */
  updatePost(id: string, engTranslation: string, vietTranslation: string, categories: string[], userId: string) {
    const post: Post = {
      id: id,
      engTranslation: engTranslation,
      vietTranslation: vietTranslation,
      categories: categories,
      creator: userId
    };
    // call to backend method
    this.http.put(environment.apiUrl +'/posts/' + id, post)
      .subscribe(response => {
        this.router.navigate(['/main-page/home']);
      });
  }

  /*
  * Get one individual post.
  * @param id id of the post
  * @return the one post (of type Post)
  */
  getPost(id: string) {
    return this.http.get<{
      _id: string,
      engTranslation: string,
      vietTranslation: string,
      categories: string[]
    }>(environment.apiUrl + '/posts/' + id);
  }

  /*
  * Adds new inputted category to array.
  * @param categoryName the name of category to be inserted in array
  * @param categories array of categories
  * @return a subject.next method call (to update observable)
  */
  addCategory(categoryName: string, categories: string[]) {
    this.categories.push(categoryName);
    this.categories = this.categories.sort();
    this.categoriesUpdated.next([...this.categories]);
    this.filterCategoriesUpdated.next([...this.categories]);
  }

  /*
  * Returns observable for posts to update posts to any changes/updates
  @return observable for posts
  */
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  /*
  * Returns observable for categories (for all posts, not individual post) to update to any
  * changes or updates
  * @return observable for categories
  */
  getCategoryUpdateListener() {
    return this.categoriesUpdated.asObservable();
  }

  /*
  * Returns observable for categories (for filtered posts)
  * @return observable for categories of filtered posts
  */
  getFilterCategoryUpdateListener() {
    return this.filterCategoriesUpdated.asObservable();
  }
}
