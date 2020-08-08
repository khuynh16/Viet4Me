import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-nav-links',
  templateUrl: './form-nav-links.component.html',
  styleUrls: ['./form-nav-links.component.css']
})
export class FormNavLinksComponent implements OnInit {
  isLogInPage: boolean;
  currentRoute: ActivatedRoute;

  constructor(private route: ActivatedRoute) {
    this.currentRoute = route;
  }

  ngOnInit(): void {
    if (this.currentRoute.snapshot.url[0].path === 'log-in') {
      this.isLogInPage = true;
    } else if (this.currentRoute.snapshot.url[0].path === 'sign-up') {
      this.isLogInPage = false;
    }
  }

  onSwitchMode() {
    if (this.currentRoute.snapshot.url[0].path === 'log-in') {
      this.isLogInPage = true;
    } else if (this.currentRoute.snapshot.url[0].path === 'sign-up') {
      this.isLogInPage = false;
    }
  }
}
