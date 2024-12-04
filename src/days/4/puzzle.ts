import { numberSum } from '../../helpers/number-sum';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly letters = ['X', 'M', 'A', 'S'];

  solveFirst(): PuzzleResult {
    const lines = splitIntoLines(this.input).map((line) => line.split(''));
    let xmasCount = 0;

    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] === this.letters[0]) {
          xmasCount += this.getNumberOfCorrectWordsInAllDirections(lines, i, j);
        }
      }
    }

    return xmasCount;
  }

  solveSecond(): PuzzleResult {
    const lines = splitIntoLines(this.input).map((line) => line.split(''));
    let xmasCount = 0;

    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] === 'A') {
          xmasCount += this.isXShapeCorrect(lines, i, j) ? 1 : 0;
        }
      }
    }

    return xmasCount;
  }

  private getNumberOfCorrectWordsInAllDirections(
    lines: string[][],
    startI: number,
    startJ: number
  ): number {
    let correctWords = 0;

    for (const dirI of [-1, 0, 1]) {
      for (const dirJ of [-1, 0, 1]) {
        if (dirI === 0 && dirJ === 0) {
          continue;
        }

        let nextI = startI;
        let nextJ = startJ;

        for (
          let letterIndex = 1;
          letterIndex < this.letters.length;
          letterIndex++
        ) {
          nextI = nextI + dirI;
          nextJ = nextJ + dirJ;

          if (
            !this.isInBounds(lines, nextI, nextJ) ||
            lines[nextI][nextJ] !== this.letters[letterIndex]
          ) {
            break;
          }

          if (letterIndex === this.letters.length - 1) {
            correctWords++;
          }
        }
      }
    }

    return correctWords;
  }

  private isInBounds(lines: string[][], i: number, j: number) {
    return i >= 0 && i < lines.length && j >= 0 && j < lines[i].length;
  }

  private isXShapeCorrect(lines: string[][], i: number, j: number) {
    if (i <= 0 || i >= lines.length - 1 || j <= 0 || j >= lines[i].length - 1) {
      return false;
    }

    const isFirstDiagonalCorrect =
      (lines[i - 1][j - 1] === 'M' && lines[i + 1][j + 1] === 'S') ||
      (lines[i - 1][j - 1] === 'S' && lines[i + 1][j + 1] === 'M');

    const isSecondDiagonalCorrect =
      (lines[i - 1][j + 1] === 'M' && lines[i + 1][j - 1] === 'S') ||
      (lines[i - 1][j + 1] === 'S' && lines[i + 1][j - 1] === 'M');

    return isFirstDiagonalCorrect && isSecondDiagonalCorrect;
  }
}
