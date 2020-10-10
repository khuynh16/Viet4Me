import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        if (isAuthenticated === false)
          this.router.navigate(['/landing-page']);
      });
  }

  onResize(event) {
    if (event.target.innerWidth >= 661) {
      this.menuTrigger.closeMenu();
    }
  }

  onLogOut() {
    this.authService.logout();
  }

  backToLandingPage() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
