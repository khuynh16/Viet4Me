import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private categories: string[] = [];
  private postsUpdated = new Subject<Post[]>();
  private categoriesUpdated = new Subject<string[]>();

  constructor(private http: HttpClient) {}

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

    this.http.post<{ message: string }>("http://localhost:3000/api/posts", post)
      .subscribe(responseData => {
      console.log(responseData.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });

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
