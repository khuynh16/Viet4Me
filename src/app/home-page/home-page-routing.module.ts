import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { PostsCreateComponent } from '../posts/posts-create/posts-create.component';
import { ManageAccountComponent } from '../manage-account/manage-account.component';
import { RenameCategoryComponent } from '../manage-account/rename-category/rename-category.component';
import { DeleteCategoryComponent } from '../manage-account/delete-category/delete-category.component';
import { ChangeEmailComponent } from '../manage-account/change-email/change-email.component';
import { ChangePasswordComponent } from '../manage-account/change-password/change-password.component';

const routes: Routes =[
  { path: 'home', component: HomePageComponent },
  { path: 'add-content', component: PostsCreateComponent },
  { path: 'edit-content/:postId', component: PostsCreateComponent },
  { path: 'manage-account', component: ManageAccountComponent },
  { path: 'manage-account/rename-category', component: RenameCategoryComponent },
  { path: 'manage-account/delete-category', component: DeleteCategoryComponent },
  { path: 'manage-account/change-email', component: ChangeEmailComponent },
  { path: 'manage-account/change-password', component: ChangePasswordComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class HomePageRoutingModule {}
