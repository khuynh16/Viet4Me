import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { GoogleObj } from '../../google-translate/translate.model';
import { GoogleTranslateService } from '../../google-translate/google-translate.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit, OnDestroy {
  // checkbox variables
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  // caetgory variables
  categories: string[] = [];
  private categoriesSub: Subscription;

  private mode = 'create';
  private postId: string;
  post: Post;
  isChecked = true;
  isLoading = false;

  constructor(public postsService: PostsService,
    public route: ActivatedRoute,
    private google: GoogleTranslateService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // if postid exists, we are in edit mode; otherwise
      // we are in create mode
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            engTranslation: postData.engTranslation,
            vietTranslation: postData.vietTranslation,
            categories: postData.categories
          }
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });

    // below is category stuff; to deal with later
    this.postsService.getCategories();
    this.categoriesSub = this.postsService.getCategoryUpdateListener()
      .subscribe((categories: string[]) => {
        this.categories = categories;
        console.log(this.categories);
      });

  }

  onAddCategory(categoryName: string) {
    if (categoryName === '') {
      return;
    }
    this.postsService.addCategory(categoryName, this.categories);
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // load spinner when post is saved/edited
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        form.value.engTranslation,
        'viet translation here!',
        this.categories
      );
    } else  {
      this.postsService.updatePost(
        this.postId,
        form.value.engTranslation,
        'viet translation update!',
        this.categories
      );
    }



    form.resetForm();
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}

