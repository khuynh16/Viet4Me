import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  logInForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.logInForm =  this.formBuilder.group({
      'logInEmail': new FormControl(null, Validators.required),
      'logInPassword': new FormControl(null, Validators.required)
    });
  }

  onSubmit(form) {
    console.log('HELLO');
    console.log(form.controls);
    if (this.logInForm.invalid === true) {
      return;
    } else {
      this.authService.login(form.controls.logInEmail.value, form.controls.logInPassword.value);
    }
  }

}
