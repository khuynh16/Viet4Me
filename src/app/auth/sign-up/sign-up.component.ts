import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { trigger, style, animate, transition, keyframes, query } from '@angular/animations';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  animations: [
    trigger('formAnimation', [
      transition('* => start', [
        query('.signupForm',
          animate('700ms', keyframes([
            style({ opacity: 0, transform: 'translateY(-75px)', offset: 0 }),
            style({ opacity: 0.5, transform: 'translateY(-35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
          ]))),
      ])
    ])
  ]
})
export class SignUpComponent implements OnInit {
  toAnimate = 'start';
  signUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public authService: AuthService) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      'signUpEmail': new FormControl(null, Validators.required),
      'newPassword': new FormControl(null, Validators.required),
      'reenterPassword': new FormControl(null, Validators.required)
    })
  }

  onSubmit(form) {
  	if(this.signUpForm.invalid === true)
  		return;
  	else
      this.authService.createUser(form.controls.signUpEmail.value, form.controls.newPassword.value, form.controls.reenterPassword.value);
  }
}
