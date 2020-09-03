import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';

import { PostsService } from '../posts.service';
import { GoogleObj } from '../../google-translate/translate.model';
import { GoogleTranslateService } from '../../google-translate/google-translate.service';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit {
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;

  categories: string[] = [];

  constructor(public postsService: PostsService, private google: GoogleTranslateService) { }

  ngOnInit(): void {

  }

  // probably need a categoryupdatelistener (subscription) to keep track of category array
  onAddCategory(categoryName: string) {
    if (categoryName === '') {
      return;
    }
      this.categories.push(categoryName);
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.postsService.addPost(
              form.value.engTranslation,
              'viet translation here!',
              ['good talk', 'animals']);

    // console.log(this.translatedInViet);
    form.resetForm();
  }
}
