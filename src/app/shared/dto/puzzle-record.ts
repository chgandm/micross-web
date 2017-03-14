export interface PuzzleRecord {
  $key: string;
  createdAt: number;
  createdBy: string;
  nickname: string;
  mistakes: number;
  time: number;
}
