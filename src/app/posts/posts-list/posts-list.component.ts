import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

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

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    // trigger http request when post list is loaded
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        // once we get updated posts, set spinner to false
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        console.log('this is this.posts:');
        console.log(this.posts);
      });
  }

  /*
  * @param pageData object holding data about current page
  */
  onChangedPage(pageData: PageEvent) {
    // show loading spinner when fetching posts
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}


