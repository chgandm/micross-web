/* tslint:disable:no-unused-variable */

import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { EnvInfoMockBuilder } from '../../../testutil/env-info-mock-builder';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvInfoService } from '../../services/env-info.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { baseProviders } from '../../../testutil/helpers';

class Page {
  welcome: HTMLElement;
  heading: HTMLElement;
  cardCreate: DebugElement;
  logoutLink: DebugElement;
  loginLink: DebugElement;

  constructor(private fixture: ComponentFixture<HomeComponent>) { }

  create(): Page {
    this.welcome = this.fixture.debugElement.query(By.css('.title__welcome')).nativeElement;
    this.heading = this.fixture.debugElement.query(By.css('.title__heading')).nativeElement;
    this.cardCreate = this.fixture.debugElement.query(By.css('.card__create'));
    this.logoutLink = this.fixture.debugElement.query(By.css('.link__logout'));
    this.loginLink = this.fixture.debugElement.query(By.css('.link__login'));
    return this;
  }

}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let envInfoMock: EnvInfoMockBuilder;
  let page;

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [ RouterTestingModule.withRoutes([]) ],
      providers: [
        ...baseProviders
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    page = new Page(fixture).create();
    envInfoMock = TestBed.get(EnvInfoService);
  });

  describe('in a web context', () => {

    beforeEach(() => {
      envInfoMock.setWebDefaults(true).build();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display a welcome message', () => {
      expect(page.welcome.innerText).toEqual('Welcome, testaccount');
      expect(page.welcome.hidden).toBeFalsy();
    });

    it('should show the create card', () => {
      expect(page.cardCreate).not.toBeNull();
    });

    it('should show a logout link only', () => {
      expect(page.logoutLink.nativeElement.hidden).toBeFalsy();
      expect(page.loginLink.nativeElement.hidden).toBeTruthy();
    });
  });

  describe('in a mobile context', () => {

    beforeEach(() => {
      envInfoMock.setMobileDefaults(true).build();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display a heading', () => {
      expect(page.welcome.hidden).toBeTruthy();
      expect(page.heading.innerText).toEqual('Play & Explore');
      expect(page.heading.hidden).toBeFalsy();
    });


    it('should _not_ show the create card', () => {
      expect(page.cardCreate).toBeNull();
    });

    it('should _not: show login/logout links', () => {
      expect(page.loginLink).toBeNull();
      expect(page.logoutLink).toBeNull();
    });
  });

});
