import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    return 'unsolved';
  }

  solveSecond(): PuzzleResult {
    return 'unsolved';
  }
}
