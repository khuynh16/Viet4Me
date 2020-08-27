import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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
              private router: Router) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      'signUpEmail': new FormControl(null, Validators.required),
      'newUsername': new FormControl(null, Validators.required),
      'newPassword': new FormControl(null, Validators.required),
      'reenterPassword': new FormControl(null, Validators.required)
    })
  }

  invalidEmail()
  {
  	return (this.submitted && this.signUpForm.controls.signUpEmail.errors !== null);
  }

  invalidUsername()
  {
  	return (this.submitted && this.signUpForm.controls.newUsername.errors !== null);
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
      this.router.navigate(['/home']);
  	}
  }
}
