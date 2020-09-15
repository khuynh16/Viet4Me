import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService  {
  private posts: Post[] = [];
  private categories: string[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  private categoriesUpdated = new Subject<string[]>();
  public filterCategoriesUpdated = new Subject<string[]>();

  filteredCategories: string[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  /*
  * Retrieve posts from database.
  * @return subject.next method call
  */
  getPosts(postsPerPage, currentPage) {
     const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // call to get method from backend
    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        // changing ._id to id in posts object array
        return {
          posts: postData.posts.map(post => {
            return {
              id: post._id,
              engTranslation: post.engTranslation,
              vietTranslation: post.vietTranslation,
              categories: post.categories
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

  getFilteredPosts(postsPerPage, currentPage, userInputedFilter, filteredCategories: string[], currentLanguage) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}&userfilter=${userInputedFilter}&categoryfilter=${filteredCategories}&language=${currentLanguage}`;
    // call to get method from backend
    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts/categories' + queryParams)
      .pipe(map((postData) => {
        // changing ._id to id in posts object array
        return {
          posts: postData.posts.map(post => {
            console.log('DDDDHH THE LANGUAGE IS: ' + currentLanguage);
            if (currentLanguage === 'ENG') {
              return {
                id: post._id,
                engTranslation: post.engTranslation,
                vietTranslation: post.vietTranslation,
                categories: post.categories
              };
            } else if (currentLanguage === 'VIET') {
              return {
                id: post._id,
                engTranslation: post.vietTranslation,
                vietTranslation: post.engTranslation,
                categories: post.categories
              };
            }
          }), maxPosts: postData.maxPosts
        };
      }))
      .subscribe(transformedPostData => {
        console.log('this.posts!!!!!!');

        this.posts = transformedPostData.posts;
        console.log(this.posts);
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
    console.log('inside');
    console.log(this.posts);
    // this.getFilterCategoryUpdateListener().subscribe((t: string[]) => {
    //   console.log('HELLO!');
    //   console.log(t);
    //   this.categories = t;
    // });

    // somehow import filtered categories here
    // in loop below, if post's category is one of the filtered categories and already isn't in array,
    // add to array

    // but when going into add content, it calls this method. somehow avoid this.
    // array of categories, starting with all categories

    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .subscribe(postData => {
        for (let i = 0; i < postData.posts.length; i++) {
          for (let j = 0; j < postData.posts[i].categories.length; j++) {
            if (!this.categories.includes(postData.posts[i].categories[j])) {
              this.categories.push(postData.posts[i].categories[j]);
            }
          }
        }
        this.categoriesUpdated.next([...this.categories]);
        // update filter categories subscription
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
  addPost(engTranslation: string, vietTranslation: string, categories: string[]) {
    const post: Post = {
      id: null,
      engTranslation: engTranslation,
      vietTranslation: vietTranslation,
      categories: categories
    };
    this.http.post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
      .subscribe(responseData => {
        this.router.navigate(['/home']);
      });
  }

  /*
  * Deletes post from database.
  * @param postId the individual id belonging to a post
  * @return subject.next call of posts array (with deleted post)
  */
  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }

  /*
  * Updates/edits a post already in database.
  * @param id post id
  * @param engTranslation string of the english input to be translated
  * @param vietTranslation translation of engTranslation in vietnamese
  * @param categories array of categories that the post is in
  * @return a subject.next method call to update posts array
  */
  updatePost(id: string, engTranslation: string, vietTranslation: string, categories: string[]) {
    const post: Post = {
      id: id,
      engTranslation: engTranslation,
      vietTranslation: vietTranslation,
      categories: categories
    };
    // call to backend method
    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        this.router.navigate(['/home']);
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
    }>('http://localhost:3000/api/posts/' + id);
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
    console.log('categories after adding category: ' + this.categories);

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

  getFilterCategoryUpdateListener() {
    return this.filterCategoriesUpdated.asObservable();
  }
}
