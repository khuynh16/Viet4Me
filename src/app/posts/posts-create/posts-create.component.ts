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
  // mat-checkbox variables
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

  translatedInEng: string;
  translatedInViet: string;

  constructor(public postsService: PostsService,
    public route: ActivatedRoute,
    private google: GoogleTranslateService) { }

  ngOnInit(): void {
    // initialize current post categories array to empty (and to re-initialize during
    // the edit post section)
    this.currentPostCategories = [];
    // subscribing to paramMap observable to see if there is a postId (denoting we are in edit mode)
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
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

    // retrieve categories (to display when adding/editing a post)
    this.postsService.getCategories();
    this.categoriesSub = this.postsService.getCategoryUpdateListener()
      .subscribe((categories: string[]) => {
        this.categories = categories;
        console.log(this.categories);
      });
  }

  /*
  * Adding new category (to store post in).
  * @param categoryName name of category to add
  * @return call to postService.addCategory (which returns a subject.next call on categories array)
  */
  onAddCategory(categoryName: string) {
    if (categoryName === '' || this.categories.includes(categoryName)) {
      return;
    }
    this.postsService.addCategory(categoryName, this.categories);
  }

  /*
  * Action event for when a user checks or unchecks a category checkbox when editing/adding post.
  * @param e the event itself (e.g. the mat-checkbox associated with category user checks/unchecks)
  * @return change to selectedCategories array (the current categories for a post)
  */
  onChange(e:any) {
    // set variable to current post categories to start
    this.selectedCategories = this.currentPostCategories;
    if (e.checked) {
      console.log(e.source.value + ' is checked!');
      // only add to array if value isn't already in array
      if (!this.selectedCategories.includes(e.source.value)) {
        this.selectedCategories.push(e.source.value);
        // sort categories array alphabetically
        this.selectedCategories = this.selectedCategories.sort();
      }
    } else {
      console.log(e.source.value + ' is now unchecked!');
      this.selectedCategories = this.selectedCategories.filter(category => category != e.source.value);
    }
    console.log('current selected categories are below:');
    console.log(this.selectedCategories);
  }

  /*
  * Save new post or save edited post.
  * @param form the form containing post details (content to translate, categories)
  * @return nothing if invalid form; a call to postService addPost or updatePost function
  */
  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // load spinner when post is saved/edited
    this.isLoading = true;


    this.translatedInEng = form.value.engTranslation;

    // object that stores current english word/phrase to translate to vietnamese,
    // and a 'target' variable that sends to Google API to translate into vietnamese
    const googleObj: GoogleObj = {
      q: form.value.engTranslation,
      target: 'vi'
    };

    // api translates and calls addPost method in service
    this.google.translate(googleObj)
      .subscribe(
        (res: any) => {
          this.translatedInViet = res.data.translations[0].translatedText;
          if (this.mode === 'create') {
            this.postsService.addPost(
              this.translatedInEng,
              this.translatedInViet,
              this.selectedCategories
            );
          } else {
            this.postsService.updatePost(
              this.postId,
              this.translatedInEng,
              this.translatedInViet,
              this.selectedCategories
            );
          }
        },
        err => {
          console.log(err);
        }
      );

      form.resetForm();

    // if (this.mode === 'create') {
    //   this.postsService.addPost(
    //     form.value.engTranslation,
    //     'viet translation here!',
    //     this.selectedCategories
    //   );
    // } else  {
    //   this.postsService.updatePost(
    //     this.postId,
    //     form.value.engTranslation,
    //     'viet translation update!',
    //     this.selectedCategories
    //   );
    // }

  }

  /*
  * Destroy categories subscription when component isn't loaded.
  * @return unsubscribing from subscription
  */
  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}

