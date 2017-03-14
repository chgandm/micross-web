/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { click, inputValue, baseProviders } from '../../../testutil/helpers';

class Page {

  nickname: DebugElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
  submitButton: DebugElement;
  contextualLink: HTMLElement;
  error: DebugElement;

  constructor(private fixture: ComponentFixture<LoginComponent>) { }

  create(): Page {
    this.update();
    return this;
  }

  update() {
    this.fixture.detectChanges();
    this.nickname = this.fixture.debugElement.query(By.css('#nickname'));
    this.email = this.fixture.debugElement.query(By.css('#email')).nativeElement;
    this.password = this.fixture.debugElement.query(By.css('#password')).nativeElement;
    this.submitButton = this.fixture.debugElement.query(By.css('.btn-c_primary'));
    this.contextualLink = this.fixture.debugElement.query(By.css('.link')).nativeElement;
    this.error = this.fixture.debugElement.query(By.css('.alert-danger'));
  }

  enterInForm(email, password) {
    inputValue(this.email, email);
    inputValue(this.password, password);
  }

  submitForm() {
    click(this.submitButton);
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let page;

  describe('in a web context', () => {

    beforeEach(async(() => {
      return TestBed.configureTestingModule({
        declarations: [ LoginComponent ],
        imports: [ RouterTestingModule.withRoutes([]), FormsModule ],
        providers: [
          ...baseProviders
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      page = new Page(fixture).create();
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display a login dialog', () => {
        expect(page.nickname).toBeNull();
        expect(page.email).not.toBeNull();
        expect(page.password).not.toBeNull();
        expect(page.submitButton.nativeElement.innerText).toEqual('Login');
        expect(page.contextualLink.innerText).toEqual('Sign up');
    });

    it('one can switch to a registration dialog', () => {
      click(page.contextualLink);
      page.update();
      expect(page.nickname).not.toBeNull();
      expect(page.email).not.toBeNull();
      expect(page.password).not.toBeNull();
      expect(page.submitButton.nativeElement.innerText).toEqual('Create Account');
      expect(page.contextualLink.innerText).toEqual('Login');
    });


  });

});
