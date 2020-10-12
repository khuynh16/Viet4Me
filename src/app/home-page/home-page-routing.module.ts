import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { PostsCreateComponent } from '../posts/posts-create/posts-create.component';

const routes: Routes =[
  { path: 'home', component: HomePageComponent },
  { path: 'add-content', component: PostsCreateComponent },
  { path: 'edit-content/:postId', component: PostsCreateComponent },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
