import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  toBeRegistered = false;
	submitted = false;
  signUpForm: FormGroup;
  invalidPassDesc: string;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public authService: AuthService) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      'signUpEmail': new FormControl(null, Validators.required),
      'newPassword': new FormControl(null, Validators.required),
      'reenterPassword': new FormControl(null, Validators.required)
    })
  }

  invalidEmail()
  {
  	return (this.submitted && this.signUpForm.controls.signUpEmail.errors !== null);
  }

  invalidPassword()
  {
  	return (this.submitted && this.signUpForm.controls.newPassword.errors !== null);
  }

  invalidRePassword()
  {
  	return (this.submitted && this.signUpForm.controls.reenterPassword.errors !== null);
  }

  doPasswordsMatch(form) {
    return (form.value.newPassword === form.value.reenterPassword);
  }

  onSubmit(form) {
    this.submitted = true;

    // form values here
    console.log(form.controls);

  	if(this.signUpForm.invalid === true)
  	{
  		return;
  	}
  	else
  	{
      this.toBeRegistered = true;
      console.log(form.controls.newPassword.value);
      this.authService.createUser(form.controls.signUpEmail.value, form.controls.newPassword.value);
      this.router.navigate(['/home']);
  	}
  }
}
