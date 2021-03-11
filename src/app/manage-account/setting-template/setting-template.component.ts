import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-template',
  templateUrl: './setting-template.component.html',
  styleUrls: ['./setting-template.component.css']
})
export class SettingTemplateComponent implements OnInit {
  routeConfirmation: string;

  constructor(public router: Router) { }

  ngOnInit(): void {
    if (this.router.url === '/main-page/manage-account/delete-category') {
      this.routeConfirmation = 'Delete Category';
    }
    else if (this.router.url === '/main-page/manage-account/rename-category') {
      this.routeConfirmation = 'Rename Category';
    }
    else if (this.router.url === '/main-page/manage-account/change-password') {
      this.routeConfirmation = 'Change Password';
    }
    else if (this.router.url === '/main-page/manage-account/change-email') {
      this.routeConfirmation = 'Change Email';
    }
  }
}
