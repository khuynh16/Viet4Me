import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { PostsCreateComponent } from '../posts/posts-create/posts-create.component';
import { ManageAccountComponent } from '../manage-account/manage-account.component';

const routes: Routes =[
  { path: 'home', component: HomePageComponent },
  { path: 'add-content', component: PostsCreateComponent },
  { path: 'edit-content/:postId', component: PostsCreateComponent },
  { path: 'manage-account', component: ManageAccountComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
