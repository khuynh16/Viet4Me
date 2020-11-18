import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomePageComponent } from './home-page.component';
import { ManageAccountComponent } from '../manage-account/manage-account.component';
import { RenameCategoryComponent } from '../manage-account/rename-category/rename-category.component';
import { CategoriesComponent } from './filters/categories/categories.component';
import { RadioFilterBtnsComponent } from './filters/radio-display-btns/radio-display-btns.component';
import { SearchBarComponent } from './filters/search-bar/search-bar.component';
import { FiltersComponent } from './filters/filters.component';
import { VietCharactersComponent } from './filters/viet-characters/viet-characters.component';
import { HeaderModule } from '../header/header.module';
import { PostsModule } from '../posts/posts.module';
import { AngularMaterialModule } from '../angular-material.module';
import { HomePageRoutingModule } from './home-page-routing.module';
import { SettingTemplateComponent } from '../manage-account/setting-template/setting-template.component';
import { ChangeEmailComponent } from '../manage-account/change-email/change-email.component';
import { ChangePasswordComponent } from '../manage-account/change-password/change-password.component';
import { DeleteCategoryComponent } from '../manage-account/delete-category/delete-category.component';

@NgModule({
  declarations: [
    HomePageComponent,
    ManageAccountComponent,
    RenameCategoryComponent,
    DeleteCategoryComponent,
    ChangePasswordComponent,
    ChangeEmailComponent,
    SettingTemplateComponent,
    CategoriesComponent,
    RadioFilterBtnsComponent,
    SearchBarComponent,
    FiltersComponent,
    VietCharactersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    PostsModule,
    AngularMaterialModule,
    HomePageRoutingModule
  ],
  exports: [
    HomePageComponent,
    CategoriesComponent,
    RadioFilterBtnsComponent,
    SearchBarComponent,
    FiltersComponent,
    VietCharactersComponent
  ]
})
export class HomePageModule {}
