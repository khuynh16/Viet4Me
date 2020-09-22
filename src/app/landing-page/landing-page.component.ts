import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [
    trigger('buffaloAnimation', [
      state('beginningState', style({
        opacity: 1
      })),
      state('clickedState', style({
        transform: 'translateX(-150%)'
      })),
      transition('beginningState => clickedState',
        animate('1500ms', keyframes([
          style({ transform: 'rotate(0)', offset: 0 }),
          style({ transform: 'rotate(20deg)', offset: 0.3 }),
          style({ transform: 'rotate(0)', offset: 0.5 }),
          style({ transform: 'translateX(-150%)', offset: 1 })
        ]))),
    ]),
    trigger('smokeAnimation', [
      state('beginningState', style({
        opacity: 0
      })),
      state('clickedState', style({
        transform: 'translateX(-150%)'
      })),
      transition('beginningState => clickedState',
        animate('1500ms', keyframes([
          style({ opacity: 0, offset: 0 }),
          style({ opacity: 0, offset: 0.5 }),
          style({ opacity: 1, offset: 0.6 }),
          style({ opacity: 1, offset: 1 }),
        ]))),
    ]),
  ]
})
export class LandingPageComponent implements OnInit {
  beginningState = 'beginningState';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  toLoginPage() {
    this.beginningState = 'clickedState';

    setTimeout(() => {
      this.router.navigate(['/log-in']);
    }, 5000);  //5s
  }

}
