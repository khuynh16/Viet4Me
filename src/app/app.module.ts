import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { UseAsGuestComponent } from './use-as-guest/use-as-guest.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FormNavLinksComponent } from './auth/form-nav-links/form-nav-links.component';
import { HeaderComponent } from './header/header.component';
import { PostsCreateComponent } from './posts/posts-create/posts-create.component';
import { CategoriesComponent } from './home-page/filters/categories/categories.component';
import { RadioFilterBtnsComponent } from './home-page/filters/radio-display-btns/radio-display-btns.component';
import { SearchBarComponent } from './home-page/filters/search-bar/search-bar.component';
import { FiltersComponent } from './home-page/filters/filters.component';
import { PostsListComponent } from './posts/posts-list/posts-list.component';
import { VietCharactersComponent } from './home-page/filters/viet-characters/viet-characters.component';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LogInComponent,
    SignUpComponent,
    UseAsGuestComponent,
    HomePageComponent,
    FormNavLinksComponent,
    HeaderComponent,
    PostsCreateComponent,
    CategoriesComponent,
    RadioFilterBtnsComponent,
    SearchBarComponent,
    FiltersComponent,
    PostsListComponent,
    VietCharactersComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }

//{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
