import {
  Component, Input, ElementRef, ViewChild, OnDestroy, AfterViewInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

/**
 * This component visualizes puzzle data by dynamically drawing its tiles on to an HTML5 canvas
 * in a randomized fashion, creating the effect of the tiles being 'filled in' by hand.
 */
@Component({
  selector: 'app-puzzle-preview',
  template: `
    <canvas #canvas
            style.width = "{{width}}px"
            style.height = "{{height}}px"
            width="{{width * pixelRatio}}" height="{{height * pixelRatio}}"></canvas>
   `,
  styleUrls: ['puzzle-preview.component.css']
})
export class PuzzlePreviewComponent implements AfterViewInit, OnDestroy {

  /**
   * Component properties
   */
  @ViewChild('canvas') canvasRef: ElementRef;

  @Input()
  color = '#fff';

  @Input()
  width = 0;

  @Input()
  height = 0;

  @Input()
  puzzleData: Observable<number[][]>;

  @Input()
  animate = true;

  puzzleDataSub: Subscription;

  pixelRatio = (window.devicePixelRatio != null) ? window.devicePixelRatio : 1;

  ctx: CanvasRenderingContext2D;

  /**
   * Animation properties
   */
  framesPerSecond = 5; // modify this in order to "speed-up" the animation
  rows: number[];
  cols: number[];
  tileWidth: number;
  tileHeight: number;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
    if (this.puzzleData != null) {
      this.puzzleDataSub = this.puzzleData.subscribe(puzzle => {
        // compute the order in which individual tiles will be drawn
        this.rows = this.shuffle(this.range(puzzle.length));
        this.cols = this.shuffle(this.range(puzzle[0].length));
        // compute the tile size
        this.tileWidth = this.width / this.rows.length;
        this.tileHeight = this.height / this.cols.length;
        if (this.animate === true) {
          window.requestAnimationFrame(() => {
            this.drawTileIncrements(puzzle, this.ctx, 1, 1);
          });
        } else {
          this.drawTileIncrements(puzzle, this.ctx, this.rows.length, this.cols.length);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.puzzleDataSub != null) {
      this.puzzleDataSub.unsubscribe();
    }
  }

  private drawTileIncrements(puzzle: number[][], ctx: CanvasRenderingContext2D, rowLength: number, colLength: number) {
    ctx.clearRect(0, 0, this.width, this.height);
    for (let x = 0; x < rowLength; x++) {
      for (let y = 0; y < colLength; y++) {
        const row = this.rows[x];
        const col = this.cols[y];
        if (puzzle[row][col] === 1) {
          ctx.fillStyle = this.color;
          ctx.fillRect(col * this.tileWidth, row * this.tileHeight, this.tileWidth, this.tileHeight);
        }
      }
    }
    if (this.animate) {
      if (++rowLength <= puzzle.length && ++colLength <= puzzle[0].length) {
        setTimeout(() => {
          window.requestAnimationFrame(() => {
            this.drawTileIncrements(puzzle, ctx, rowLength, colLength);
          });
        }, 1000 / this.framesPerSecond);
      }
    }
  }

  private range(limit: number) {
    const arr = [];
    for (let i = 0; i < limit; i++) {
      arr[i] = i;
    }
    return arr;
  }

  /**
   * Randomize array element order in-place.
   * Using Durstenfeld shuffle algorithm.
   */
  private shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
}
