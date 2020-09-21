import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PostsService } from '../posts/posts.service';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private token: string;
  private userId: string;
  private tokenTimer: number;
  private authStatusListener = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
      return this.token;
    }

    getUserId() {
      return this.userId;
    }

    getAuthStatusListener() {
      return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string) {
      const authData: AuthData = { email: email, password: password };
        this.http.post<{message: string, userId: string}>('http://localhost:3000/api/user/signup', authData)
          .subscribe(response => {
            console.log(response);
            this.authStatusListener.next(true);
            this.userId = response.userId;
            this.router.navigate(['/home']);
          });
    }

    login(email: string, password: string) {
      const authData: AuthData = { email: email, password: password };
      this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
        .subscribe(response => {
          console.log(response);
          const token = response.token;
          this.token = token;
          this.userId = response.userId;
          if (token) {
            const expiresInDuration = response.expiresIn;
            // token assigned to logout after 1 hour
            this.tokenTimer = setTimeout(() => {
              this.logout();
            }, expiresInDuration * 1000);
            this.authStatusListener.next(true);
            this.router.navigate(['/home']);
          }

        });
    }

    logout() {
      this.token = null;
      this.userId = null;
      this.authStatusListener.next(false);
      // this.postsService.filterCategoriesUpdated.next([]);
      this.router.navigate(['/landing-page']);
      // clears token timer to be used again when logged in
      clearTimeout(this.tokenTimer);
    }

    toLogin() {
      this.router.navigate(['/log-in']);
    }
}
