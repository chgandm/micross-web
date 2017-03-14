/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportComponent } from './support.component';
import { By } from '@angular/platform-browser';

describe('SupportComponent', () => {
  let component: SupportComponent;
  let fixture: ComponentFixture<SupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the correct title', () => {
    expect(fixture.debugElement.query(By.css('h1')).nativeElement.innerText).toEqual('Support');
  });
});
