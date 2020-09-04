import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { GoogleObj } from '../../google-translate/translate.model';
import { GoogleTranslateService } from '../../google-translate/google-translate.service';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit, OnDestroy {
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;

  categories: string[] = [];
  private categoriesSub: Subscription;

  constructor(public postsService: PostsService, private google: GoogleTranslateService) { }

  ngOnInit(): void {
    this.categories = this.postsService.getCategories();
    this.categoriesSub = this.postsService.getCategoryUpdateListener()
      .subscribe((categories: string[]) => {
        this.categories = categories;
      });
    console.log('categories: ' + this.categories);

  }

  onAddCategory(categoryName: string) {
    if (categoryName === '') {
      return;
    }
    this.postsService.addCategory(categoryName, this.categories);
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.postsService.addPost(
              form.value.engTranslation,
              'viet translation here!',
              this.categories);

    form.resetForm();
  }

  ngOnDestroy() {
    this.categoriesSub.unsubscribe();
  }
}

