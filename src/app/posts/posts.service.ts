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

  // the element in brackets to match the content
  // in the app.js file
  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
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

  getCategories() {
    return [...this.categories];
  }

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
  * deletes post from database
  * @param postId the individual id belonging to a post
  * - HTTP delete API and subscribing
  * - creates updatedPosts and filters out post element with postId
  *   to be deleted, and stores resulting array in variable
  * - assign current posts variable with new variable
  * - update subscription with newly created posts
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
  * updates/edits a post already in database
  * creates post with new variable
  * store current posts array in temp variable
  * get index of post in posts array that will be edited
  * replace old post with new (edited) post
  * initialize posts array with updated posts
  */
  updatePost(id: string, engTranslation: string, vietTranslation: string, categories: string[]) {
    const post: Post = {
      id: id,
      engTranslation: engTranslation,
      vietTranslation: vietTranslation,
      categories: categories
    };
    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/home']);
      });

  }

  getPost(id: string) {
    return this.http.get<{_id: string, engTranslation: string, vietTranslation: string, categories: string[]}>('http://localhost:3000/api/posts/' + id);
  }

  addCategory(categoryName: string, categories: string[]) {
    this.categories.push(categoryName);
    this.categoriesUpdated.next([...this.categories]);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getCategoryUpdateListener() {
    return this.categoriesUpdated.asObservable();
  }
}
