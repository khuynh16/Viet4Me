import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FormNavLinksComponent } from './form-nav-links/form-nav-links.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [
    LogInComponent,
    SignUpComponent,
    FormNavLinksComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    LogInComponent,
    SignUpComponent,
    FormNavLinksComponent
  ]
})
export class AuthModule {}
