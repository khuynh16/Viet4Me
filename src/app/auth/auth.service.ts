import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../src/environments/environment';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private token: string;
  private userId: string;
  private tokenTimer: number;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  /*
  * Getter method for token.
  * @return user token
  */
  getToken() {
    return this.token;
  }

  /*
  * Getter method for userId.
  * @return user id
  */
  getUserId() {
    return this.userId;
  }

  /*
  * Observable for auth status (true or false value)
  * @return an observable for auth status behavior subject
  */
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /*
  * Create new user to database.
  * @param email user's email
  * @param password user's password
  * @return call to http request of creating user and navigating to home page
  */
  createUser(email: string, password: string, reenterPassword: string) {
    const authData: AuthData = { email: email, password: password, reenterPassword: reenterPassword };
      this.http.post<{message: string, userId: string}>(environment.apiUrl + '/user/signup', authData)
        .subscribe(response => {
          this.authStatusListener.next(true);
          this.userId = response.userId;
          this.router.navigate(['/main-page/home']);
        }, error => {
        });
  }

  /*
  * Log in user to application.
  * @param email user's email
  * @param password user's password
  * @return http request to logging in user, setting observable value to true, and navigating home
  */
  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    console.log(environment.apiUrl);
    this.http.post<{token: string, expiresIn: number, userId: string}>(environment.apiUrl + '/user/login', authData)
      .subscribe(response => {
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
          this.router.navigate(['/main-page/home']);
        }

      });
  }

  /*
  * Log out user from application.
  * @return multiple values to null, auth status observable to false, clearing token timer, and navigating home
  */
  logout() {
    this.token = null;
    this.userId = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/landing-page']);
    // clears token timer to be used again when logged in
    clearTimeout(this.tokenTimer);
  }
}
