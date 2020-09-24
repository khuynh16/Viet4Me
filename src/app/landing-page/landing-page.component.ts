import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition, keyframes, query, group } from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [
    trigger('buffaloAnimation', [
      transition('* => clickedState', [

        query('.smoke-bg-image', style({ opacity: 0 })),
        query('.buffalo-bg-image', style({ opacity: 1 })),

        group([
          query('.buffalo-bg-image',
          animate('1500ms', keyframes([
            style({ transform: 'rotate(0)', offset: 0 }),
            style({ transform: 'rotate(20deg)', offset: 0.3 }),
            style({ transform: 'rotate(0)', offset: 0.5 }),
            style({ transform: 'translateX(-120vh)', offset: 1 })
          ]))),
          query('.smoke-bg-image',
          animate('1500ms', keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0, offset: 0.5 }),
            style({ opacity: 1, offset: 0.51 }),
            style({ transform: 'translateX(-120vh)', offset: 1 })
          ])))
        ]),
      ])
        // animate('1500ms', keyframes([
        //   style({ transform: 'rotate(0)', offset: 0 }),
        //   style({ transform: 'rotate(20deg)', offset: 0.3 }),
        //   style({ transform: 'rotate(0)', offset: 0.5 }),
        //   style({ transform: 'translateX(-150%)', offset: 1 })
        // ]))),
    ])
  ]
})
export class LandingPageComponent implements OnInit {
  beginningState = '';
  isSmokeDisplayed = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick(routePath: string) {
    this.beginningState = 'clickedState';
    this.isSmokeDisplayed = true;

    setTimeout(() => {
      this.router.navigate(['/' + routePath]);
    }, 1500);
  }
}
