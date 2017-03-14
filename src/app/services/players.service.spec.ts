/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { PlayersService } from './players.service';
import { AngularFire, AngularFireModule } from 'angularfire2';
import 'rxjs/add/operator/first';
import { environment } from '../../environments/environment';
import { PuzzleTrophies } from '../shared/dto/puzzle-trophies';

xdescribe('PlayersService', () => {

  let service: PlayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:    [ AngularFire, PlayersService ],
      imports: [ AngularFireModule.initializeApp(environment.firebaseConfig) ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(PlayersService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('provides the basis for a reactive UI by returning subscribable Observers', () => {
    it('when fetching top player trophies', () => {
      expect(service.fetchTopPlayerTrophies()).toBeDefined('subscribe()');
    });

  });

  describe('provides a meaningful layer of abstraction by transforming data into', () => {
    it('multiple puzzle trophies',  (done) => {
      service.fetchTopPlayerTrophies().first().subscribe((result: [PuzzleTrophies]) => {
        expect(result[0].gold).not.toBeNull();
        expect(result[0].silver).not.toBeNull();
        expect(result[0].bronze).not.toBeNull();
        done();
      });
    });
  });
});
