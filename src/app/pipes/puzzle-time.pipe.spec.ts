/* tslint:disable:no-unused-variable */

import { PuzzleTimePipe } from './puzzle-time.pipe';

describe('PuzzleTimePipe', () => {
  let pipe: PuzzleTimePipe;

  beforeEach(() => {
    pipe = new PuzzleTimePipe();
  });

  it('should properly translate values', () => {
    expect(pipe.transform(0 * 1000)).toEqual('0s');
    expect(pipe.transform(59 * 1000)).toEqual('59s');
    expect(pipe.transform(60 * 1000)).toEqual('1min 0s');
    expect(pipe.transform(61 * 1000)).toEqual('1min 1s');
    expect(pipe.transform(119 * 1000)).toEqual('1min 59s');
    expect(pipe.transform(120 * 1000)).toEqual('2min 0s');
    expect(pipe.transform(121 * 1000)).toEqual('2min 1s');
    expect(pipe.transform(60 * 60 * 1000 - 1 * 1000)).toEqual('59min 59s');
    expect(pipe.transform(60 * 60 * 1000)).toEqual('over 1h');
  });

});
