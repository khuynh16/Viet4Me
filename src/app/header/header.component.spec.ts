import { Component } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { HeaderComponent } from './header.component';
import { AngularMaterialModule } from '../angular-material.module';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let router: Router;
    let location: Location;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'landing-page', component: DummyComponent },
                    { path: 'main-page/home', component: DummyComponent },
                    { path: 'main-page/add-content', component: DummyComponent }
                ]),
                HttpClientTestingModule,
                AngularMaterialModule
            ],
            declarations: [
                HeaderComponent
            ],
            providers: []
        })
        .compileComponents();
      }));

    beforeEach(() => {
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        //router.initialNavigation();
        
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create header component', () => {
        expect(component).toBeDefined();     
    });

    it('should have logo', () => {
        const logo = fixture.debugElement.query(By.css('.logo'));
        expect(logo).toBeTruthy();
    });

    it ('should have 4 total links in header (to represent back to home, add content, manage account, and log out)', () => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        expect(links.length).toBe(4);      
    });

    it('should have the first link be \'Home', () => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        const homeLink: HTMLButtonElement = links[0].nativeElement;
        expect(homeLink.textContent).toBe('Home');
    });

    it('should have the second link be \'Add Content\'', () => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        const addContentLink: HTMLButtonElement = links[1].nativeElement;
        expect(addContentLink.textContent).toBe('Add Content');
    });

    it('should have the third link be \'Manage Account\'', () => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        const manageAccountLink = links[2].nativeElement;
        expect(manageAccountLink.textContent).toBe('Manage Account');
    });

    it('should have the fourth link be \'Log Out\'', () => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        const logOutLink = links[3].nativeElement;
        expect(logOutLink.textContent).toBe('Log Out');  
    });

    it('should have vertical line spacer separating logo and header links', () => {
        const spacer = fixture.debugElement.query(By.css('.spacer'));
        expect(spacer).toBeTruthy();
    });

    it('should go to /landing-page when logo is clicked', async(() => {
        const logo = fixture.debugElement.nativeElement.querySelector('.logo');
        logo.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(location.path()).toBe('/landing-page');
        });
    }));

    it('should go to /main-page/home when \'home\' is clicked', async(() => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        const homeLink = links[0].nativeElement;
        homeLink.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(location.path()).toBe('/main-page/home');
        });
    }));

    it('should go to /main-page/add-content when \'add content\' is clicked', async(() => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        const addContentLink = links[1].nativeElement;
        addContentLink.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(location.path()).toBe('/main-page/add-content');
        });
    }));

    it('should go back to /landing-page when \'log out\' is clicked', async(() => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        const logOutLink = links[3].nativeElement;
        logOutLink.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(location.path()).toBe('/landing-page');
        });
    }));

    it('should hide/show hamburger menu, depending in window width', () => {
        const hamburger = fixture.debugElement.nativeElement.querySelector('.hamburger');
        const hamburgerStyle = getComputedStyle(hamburger);
        viewport.set('screen');
        expect(hamburgerStyle.display).toBe('none');
        viewport.set('mobile');
        expect(hamburgerStyle.display).toBe('block');
    });

    it('should have one hamburger menu for nav links when viewing in small width browsers/devices', () => {
        const menu = fixture.debugElement.queryAll(By.css('mat-menu'));
        expect(menu).toBeTruthy();
        expect(menu.length).toBe(1);
    });
});

@Component({
    template: ''
})
class DummyComponent {}