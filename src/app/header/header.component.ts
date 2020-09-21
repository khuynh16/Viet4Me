import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        console.log('inside auth: ' + isAuthenticated);
        this.userIsAuthenticated = isAuthenticated;
      });
    console.log('authenticitiy is!: ' + this.userIsAuthenticated);
  }

  onLogOut() {
    this.authService.logout();
  }

  onLogIn() {
    this.authService.toLogin();
  }

  backToLandingPage() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
