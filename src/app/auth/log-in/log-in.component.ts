import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { trigger, style, animate, transition, keyframes, query } from '@angular/animations';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  animations: [
    trigger('formAnimation', [
      transition('* => start', [
        query('.loginForm',
          animate('700ms', keyframes([
            style({ opacity: 0, transform: 'translateY(-75px)', offset: 0 }),
            style({ opacity: 0.5, transform: 'translateY(-35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ]))),
      ])
    ])
  ]
})
export class LogInComponent implements OnInit {
  logInForm: FormGroup;
  toAnimate = 'start';

  constructor(private formBuilder: FormBuilder,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.logInForm =  this.formBuilder.group({
      'logInEmail': new FormControl(null, Validators.required),
      'logInPassword': new FormControl(null, Validators.required)
    });
  }

  /*
  * Submits form.
  * @param form the form to submit (containing login credentials)
  * @return nothing if invalid form; a call to authService login method if valid form
  */
  onSubmit(form) {
    if (this.logInForm.invalid === true) {
      return;
    } else {
      this.authService.login(form.controls.logInEmail.value, form.controls.logInPassword.value);
    }
  }
}
