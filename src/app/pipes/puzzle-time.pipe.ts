import { Pipe, PipeTransform } from '@angular/core';

/**
 * Display the time (in ms) it took to solve a puzzle.
 * Usage:
 *   value | puzzletime
 * Example:
 *   {{ 32000 | puzzletime}}
 *   formats to: 1min 32s
 */
@Pipe({name: 'puzzletime'})
export class PuzzleTimePipe implements PipeTransform {

  transform(value: number): string {
    const hours = Math.floor(value / 1000 / 60 / 60) % 60;
    const minutes = Math.floor(value / 1000 / 60) % 60;
    const seconds = Math.round((value / 1000) % 60);
    if (hours > 0) {
      return 'over 1h';
    }
    let displayedPuzzleTime = '';
    if (minutes >= 0 && seconds >= 0) {
      if (minutes > 0) {
        displayedPuzzleTime = minutes + 'min ';
      }
      displayedPuzzleTime += seconds + 's';
    }
    return displayedPuzzleTime;
  }
}
