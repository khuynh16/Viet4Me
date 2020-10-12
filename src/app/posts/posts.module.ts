import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PostsCreateComponent } from './posts-create/posts-create.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [
    PostsCreateComponent,
    PostsListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AngularMaterialModule,
    HeaderModule
  ],
  exports: [
    PostsCreateComponent,
    PostsListComponent
  ]
})
export class PostsModule {}
