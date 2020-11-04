import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
    let component: LandingPageComponent;
    let fixture: ComponentFixture<LandingPageComponent>;
    let router: Router;
    let location: Location;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    {path: '', redirectTo: '/landing-page', pathMatch: 'full' },
                    { path: 'landing-page', component: DummyComponent },
                    { path: 'auth/log-in', component: DummyComponent },
                    { path: 'auth/sign-up', component: DummyComponent }
                ]),
                BrowserAnimationsModule
            ],
            declarations: [
                LandingPageComponent
            ],
            providers: []
        })
        .compileComponents();
      }));

    beforeEach(() => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        // router.initialNavigation();
        
        fixture = TestBed.createComponent(LandingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create landing page component', () => {
        expect(component).toBeDefined();     
    });

    it('should display correct h1 title', () => {
        const h1Title = fixture.debugElement.query(By.css('h1'));
        expect(h1Title.nativeElement.textContent).toBe('Viet 4 Me!');
    });

    it ('should have only two buttons (log in and sign up)', () => {
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        expect(buttons.length).toBe(2); 
    });

    it ('should have \'Log In\' as first button text', () => {
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        const firstButton: HTMLButtonElement = buttons[0].nativeElement;
        expect(firstButton.textContent).toBe('Log In');
    });

    it ('should have \'Sign Up\' as second button text', () => {
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        const firstButton: HTMLButtonElement = buttons[1].nativeElement;
        expect(firstButton.textContent).toBe('Sign Up');
    });

    it('should navigate to \'\', and redirect to /landing-page', fakeAsync(() => {
        // fixture.ngZone.run needed to handle navigation outside Angular zone;
        // otherwise, warning is thrown
        fixture.ngZone.run(() => {
            router.navigate(['']);
            // wait for all pending promises to resolve 
            tick();
            expect(location.path()).toBe('/landing-page');
        });
    }));

    it('should navigate to /login on login button click', async(() => {
        const buttons = fixture.debugElement.queryAll(By.css('button'));
        const loginButton: HTMLButtonElement = buttons[0].nativeElement;
        loginButton.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(location.path()).toBe('/auth/log-in');
        });
        // clears timers in queue; without throws an error
        // flush();
    }));
});

@Component({
    template: ''
})
class DummyComponent {}