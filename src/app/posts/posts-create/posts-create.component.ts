import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { GoogleObj } from '../../google-translate/translate.model';
import { GoogleTranslateService } from '../../google-translate/google-translate.service';
import { Post } from '../post.model';
import { MatCheckbox } from '@angular/material/checkbox';

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
  selectedCategories: string[] = [];
  currentPostCategories: string[];
  private categoriesSub: Subscription;

  private mode = 'create';
  private postId: string;
  post: Post;
  isChecked = false;
  isLoading = false;

  constructor(public postsService: PostsService,
    public route: ActivatedRoute,
    private google: GoogleTranslateService) { }

  ngOnInit(): void {

    this.currentPostCategories = [];

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
          // here, postData.categories
          console.log('current categories are: ' + postData.categories);

          // assign current post's categories (needed in template to mark categories as
          // checked when a user clicks edit post
          this.currentPostCategories = postData.categories;



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
        // need to filter and display based on if edit or creating new one
        if (this.mode === 'create') {
          console.log('this is create!');
        } else {
          console.log('this is the edit section!');
          // need to check current categories of the selected post
        }


        this.categories = categories;
        console.log(this.categories);
      });

  }

  // determineCheckStatus(categoryName) {
  //   if (this.mode === 'edit') {
  //     // check if current category for mat checkbox
  //     console.log('category name: ' + categoryName);
  //     //console.log('this is edit mode in determineCheckStatus (unchecked)!');
  //     return true;
  //   } else {
  //     //console.log('this is create mode in determineCheckStatus (checked)!');
  //     return false;
  //   }
  // }

  isInCategory(categoryName) {
    if (categoryName)
    return true;
  }

  onAddCategory(categoryName: string) {
    if (categoryName === '') {
      return;
    }
    this.postsService.addCategory(categoryName, this.categories);
  }

  onChange(e:any) {

    // set variable to current post categories to start
    this.selectedCategories = this.currentPostCategories;

    if (e.checked) {
      console.log(e.source.value + ' is checked!');
      this.selectedCategories.push(e.source.value);
    } else {
      console.log(e.source.value + ' is now unchecked!');
      this.selectedCategories = this.selectedCategories.filter(category => category != e.source.value);
    }

    console.log('current selected categories are below:');
    console.log(this.selectedCategories);
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // load spinner when post is saved/edited
    this.isLoading = true;
    if (this.mode === 'create') {

      // somehow access which mat checkboxes are selected and store in this.categories

      this.postsService.addPost(
        form.value.engTranslation,
        'viet translation here!',
        this.selectedCategories
      );
    } else  {
      this.postsService.updatePost(
        this.postId,
        form.value.engTranslation,
        'viet translation update!',
        this.selectedCategories
      );
    }



    form.resetForm();
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}

