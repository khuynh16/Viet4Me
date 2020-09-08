import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private categories: string[] = [];
  private postsUpdated = new Subject<Post[]>();
  private categoriesUpdated = new Subject<string[]>();

  constructor(private http: HttpClient, private router: Router) {}

  /*
  * Retrieve posts from database.
  * @return subject.next method call
  */
  getPosts() {
    // call to get method from backend
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        // changing ._id to id in posts object array
        return postData.posts.map(post => {
          return {
            id: post._id,
            engTranslation: post.engTranslation,
            vietTranslation: post.vietTranslation,
            categories: post.categories
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  /*
  * Returns all categories that have been included in user posts.
  * @return subject.next method call of categories
  */
  getCategories() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .subscribe(postData => {
        for (let i = 0; i < postData.posts.length; i++) {
          for (let j = 0; j < postData.posts[i].categories.length; j++) {
            if (!this.categories.includes(postData.posts[i].categories[j])) {
              this.categories.push(postData.posts[i].categories[j]);
            }
          }
        }
        this.categoriesUpdated.next([...this.categories]);
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
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/home']);
    });
  }

  /*
  * Deletes post from database.
  * @param postId the individual id belonging to a post
  * @return subject.next call of posts array (with deleted post)
  */
  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
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
        //store current posts array in temp variable
        const updatedPosts = [...this.posts];
        //get index of post in posts array that will be edited
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        //replace old post with new (edited) post
        updatedPosts[oldPostIndex] = post;
        //initialize posts array with updated posts
        this.posts = updatedPosts;
        // update observable
        this.postsUpdated.next([...this.posts]);
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
}