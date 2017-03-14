/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPlayersComponent } from './top-players.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PlayersService } from '../../services/players.service';
import { Observable } from 'rxjs/Observable';
import Spy = jasmine.Spy;

// TODO: re-enable once the top players component is back
xdescribe('TopPlayersComponent', () => {
  let component: TopPlayersComponent;
  let fixture: ComponentFixture<TopPlayersComponent>;
  let mockPlayersService;

  /**
   * Since the TopPlayersComponent defines external templates for CSS and HTML, we need to setup
   * the test module asynchronously (in order for Angular to be able to fetch the files).
   */
  beforeEach(async(()  => {
    // Create a spy
    mockPlayersService = {
      fetchTopPlayerTrophies: jasmine.createSpy('fetchTopPlayerTrophies').and.returnValue(Observable.of([
        {gold: 'playerOne', silver: 'playerTwo', bronze: 'playerThree'},
        {gold: 'playerOne', silver: 'playerTwo', bronze: 'playerThree'}
      ]))
    };

    // Configure a "mock" test module in which the the component will "live"
    TestBed.configureTestingModule({
      declarations: [ TopPlayersComponent ],
      providers:    [
        { provide: PlayersService, useValue: mockPlayersService},
      ]
    }).compileComponents(); // compile template and css
  }));

  beforeEach(() => {
    // Create the component under test
    fixture = TestBed.createComponent(TopPlayersComponent);
    component = fixture.componentInstance;

    // Have Angular initiate data binding
    fixture.detectChanges();
  });

  it('displays the title in the correct DOM location', () => {
    const domRef: DebugElement = fixture.debugElement.query(By.css('h1'));
    const element: HTMLElement = domRef.nativeElement;
    expect(element.innerText).toEqual('Top Players');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('properly computes the top 10', async(() => {
    expect(mockPlayersService.fetchTopPlayerTrophies).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.leaderBoard.length).toEqual(3);
      expect(component.leaderBoard[0].gold).toEqual(2);
      expect(component.leaderBoard[0].silver).toEqual(0);
      expect(component.leaderBoard[0].bronze).toEqual(0);
      expect(component.leaderBoard[0].nickname).toEqual('playerOne');
      expect(component.leaderBoard[2].gold).toEqual(0);
      expect(component.leaderBoard[2].silver).toEqual(0);
      expect(component.leaderBoard[2].bronze).toEqual(2);
      expect(component.leaderBoard[2].nickname).toEqual('playerThree');
    });
  }));
});
