import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PuzzlesService } from '../../services/puzzles.service';
import { PuzzleSizeType } from '../../shared/dom/PuzzleSizeType';
import { Puzzle } from '../../shared/dom/Puzzle';
import { EnvInfoService } from '../../services/env-info.service';
import { NativeCommunicationService } from '../../services/native-communication.service';
import { microssPuzzleSize } from '../../app.constants';

/**
 * Allows new puzzles to be created (drawn) by the players.
 * The user needs to be logged-in in order to create puzzles.
 * Since on a mobile device, no mouse over event will be fired (instead the UI will scroll),
 * we allow users to 'share' the URL of the web app using their mobile's native sharing capabilities.
 * This functionality is only enabled when running in embedded mode.
 */
@Component({
  selector: 'app-create-puzzle',
  templateUrl: 'create-puzzle.component.html',
  styleUrls: ['create-puzzle.component.scss']
})
export class CreatePuzzleComponent implements OnInit {
  PuzzleSizeType = PuzzleSizeType; // we make our type available for the template
  selectedPuzzleSize: PuzzleSizeType;
  puzzlePreview: Subject<number[][]> = new Subject();
  puzzle = new Puzzle();
  email: string;
  puzzleCreated = false;
  puzzleCreationError = false;
  enoughCells = false;
  drawing = false;

  cellCssClass: string;
  puzzleRows: number[];
  puzzleCols: number[];

  constructor(private puzzlesService: PuzzlesService,
              private envInfo: EnvInfoService,
              private nativeService: NativeCommunicationService) { }

  ngOnInit() {
    this.selectedPuzzleSize = PuzzleSizeType._5x5;
    this.setPuzzleSize(this.selectedPuzzleSize);
    this.envInfo.getUser().subscribe(user => {
        this.email = user.email;
        this.puzzle.author = user.nickname;
        this.puzzle.createdBy = user.uid;
    });
  }

  toggleCell(row, col, forceDraw) {
    if (this.drawing || forceDraw) {
      this.puzzle.puzzleData[row][col] = (this.puzzle.puzzleData[row][col] === 1) ? 0 : 1;
      this.puzzlePreview.next(this.puzzle.puzzleData);
    }
  }

  setDrawing(isDrawing) {
    this.drawing = isDrawing;
  }

  setPuzzleSize(size: PuzzleSizeType) {
    this.selectedPuzzleSize = size;
    const rows = microssPuzzleSize.get(size).r;
    const cols = microssPuzzleSize.get(size).c;
    this.puzzleRows = Array(rows).fill(0).map((v, i) => i);
    this.puzzleCols = Array(cols).fill(0).map((v, i) => i);
    this.cellCssClass = this.evaluateCellClass(size);
    this.puzzle.puzzleData = this.initPuzzleData(rows, cols);
    this.puzzlePreview.next(this.puzzle.puzzleData);
  }

  getNumberOfActiveCells(): number {
    return this.puzzle.puzzleData
      .reduce((prev, curr) => prev.concat(curr))
      .reduce((prev, curr) => prev + curr, 0);
  }

  createPuzzle() {
    if (this.getNumberOfActiveCells() / (this.puzzleRows.length * this.puzzleRows.length) > 0.2) {
      this.enoughCells = true;
      this.puzzlesService.createPuzzle(this.puzzle, microssPuzzleSize.get(this.selectedPuzzleSize).id)
        .then(() => {
          this.puzzleCreated = true;
          this.puzzleCreationError = false;
        })
        .catch(error => {
          this.puzzleCreationError = true;
          console.log(error);
      });
    } else {
      this.enoughCells = false;
    }
  }

  shareLink() {
    this.nativeService.shareInNativeApplication('Continue creating Puzzles on your Notebook or Tablet: https://micross-955d7.firebaseapp.com');
  }

  private initPuzzleData(rowLength: number, colLength: number): number[][] {
    const newPuzzleData = [];
    for (let r = 0; r < rowLength; r++) {
      newPuzzleData[r] = [];
      for (let c = 0; c < colLength; c++) {
        newPuzzleData[r][c] = 0;
      }
    }
    return newPuzzleData;
  }

  private evaluateCellClass(size: PuzzleSizeType) {
    return new Map([
      [PuzzleSizeType._5x5, 'cell-5x5'],
      [PuzzleSizeType._10x10, 'cell-10x10'],
      [PuzzleSizeType._15x15, 'cell-15x15']
    ]).get(size);
  }

}
