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

  translatedInEng: string;
  translatedInViet: string;

  constructor(public postsService: PostsService, private google: GoogleTranslateService) { }

  ngOnInit(): void {

  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.translatedInEng = form.value.engTranslation;

    // translation stuff here
    const googleObj: GoogleObj = {
      q: form.value.engTranslation,
      target: 'vi'
    };

    this.google.translate(googleObj)
      .subscribe(
        (res: any) => {
          console.log(res.data.translations[0].translatedText)
          console.log('this is current eng context: ' + this.translatedInEng);
          this.translatedInViet = res.data.translations[0].translatedText;
          this.postsService.addPost(
            this.translatedInEng,
            this.translatedInViet,
            ['good talk', 'animals']);
        },
        err => {
          console.log(err);
        }
      );

    // console.log(this.translatedInViet);
    form.resetForm();
  }
}
