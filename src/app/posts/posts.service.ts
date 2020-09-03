import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor() {}

  getPosts() {
    return [...this.posts];
  }

  addPost(engTranslation: string, vietTranslation: string, categories: string[]) {
    const post: Post = {
      engTranslation: engTranslation,
      vietTranslation: vietTranslation,
      categories: categories
    };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]); // pushes new value to subject
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
