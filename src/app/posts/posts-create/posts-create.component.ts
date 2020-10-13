import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm, NgModel} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { GoogleObj } from '../../google-translate/translate.model';
import { GoogleTranslateService } from '../../google-translate/google-translate.service';
import { Post } from '../post.model';
import { AuthService } from 'src/app/auth/auth.service';

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

  categories: string[] = [];
  selectedCategories: string[] = [];
  isChecked = false;
  isLoading = false;
  currentPostCategories: string[];
  private categoriesSub: Subscription;
  private mode = 'create';
  private postId: string;
  post: Post;
  translatedInEng: string;
  translatedInViet: string;
  userId: string;

  @ViewChild('newCategory') newCategory: NgModel;

  constructor(public postsService: PostsService,
    public route: ActivatedRoute,
    private google: GoogleTranslateService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.currentPostCategories = [];
    this.userId = this.authService.getUserId();
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
            categories: postData.categories,
            creator: this.userId
          }
          this.currentPostCategories = postData.categories;
          this.selectedCategories = this.currentPostCategories;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
    this.postsService.getCategories();
    this.categoriesSub = this.postsService.getCategoryUpdateListener()
      .subscribe((categories: string[]) => {
        this.categories = categories;
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
    this.newCategory.reset();
    this.postsService.addCategory(categoryName, this.categories);
  }

  /*
  * Action event for when a user checks or unchecks a category checkbox when editing/adding post.
  * @param e the event itself (e.g. the mat-checkbox associated with category user checks/unchecks)
  * @return change to selectedCategories array (the current categories for a post)
  */
  onChange(e:any) {
    // initial state to be either:
    // -empty if user is creating a new post
    // -array of all categories from user's current posts
    this.selectedCategories = this.currentPostCategories;
    // adding category to array if user is checking the category box or removing category from array
    // if user is unchecking category box
    if (e.checked) {
      if (!this.selectedCategories.includes(e.source.value)) {
        this.selectedCategories.push(e.source.value);
        this.selectedCategories = this.selectedCategories.sort();
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(category => category != e.source.value);
    }
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
              this.selectedCategories,
              this.userId
            );
          } else {
            this.postsService.updatePost(
              this.postId,
              this.translatedInEng,
              this.translatedInViet,
              this.selectedCategories,
              this.userId
            );
          }
        },
        err => {
          console.log(err);
        }
      );
    form.resetForm();
  }

  /*
  * Destroy categories subscription when component isn't loaded.
  * @return unsubscribing from subscription
  */
  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}
