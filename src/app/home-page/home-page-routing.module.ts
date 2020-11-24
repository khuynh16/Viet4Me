import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeaderModule } from '../header/header.module';

import { HomePageComponent } from './home-page.component';
import { PostsCreateComponent } from '../posts/posts-create/posts-create.component';
import { ManageAccountComponent } from '../manage-account/manage-account.component';
import { RenameCategoryComponent } from '../manage-account/rename-category/rename-category.component';
import { DeleteCategoryComponent } from '../manage-account/delete-category/delete-category.component';
import { ChangeEmailComponent } from '../manage-account/change-email/change-email.component';
import { ChangePasswordComponent } from '../manage-account/change-password/change-password.component';
import { SettingTemplateComponent } from '../manage-account/setting-template/setting-template.component';
// import { SettingTemplateComponent } from '../manage-account/setting-template/setting-template.component';

const routes: Routes =[
  { path: 'home', component: HomePageComponent },
  { path: 'add-content', component: PostsCreateComponent },
  { path: 'edit-content/:postId', component: PostsCreateComponent },
  { path: 'manage-account', component: ManageAccountComponent },
  { path: 'manage-account/rename-category', component: SettingTemplateComponent },
  { path: 'manage-account/delete-category', component: SettingTemplateComponent },
  { path: 'manage-account/change-email', component: SettingTemplateComponent },
  { path: 'manage-account/change-password', component: SettingTemplateComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule, HeaderModule],
  declarations: []
})
export class HomePageRoutingModule {}
