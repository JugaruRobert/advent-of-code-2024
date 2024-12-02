import { numberSum } from '../../helpers/number-sum';
import { parseIntoNumbers } from '../../helpers/parse-into-numbers';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst() {
    const reports = splitIntoLines(this.input).map((line) =>
      parseIntoNumbers(line)
    );
    return numberSum(
      reports.map((report) => Number(this.isReportSafe(report)))
    );
  }

  solveSecond(): PuzzleResult {
    const reports = splitIntoLines(this.input).map((line) =>
      parseIntoNumbers(line)
    );

    return numberSum(
      reports
        .map((report) => {
          if (this.isReportSafe(report)) {
            return true;
          }

          for (let i = 0; i < report.length; i++) {
            const slice = [...report.slice(0, i), ...report.slice(i + 1)];
            if (this.isReportSafe(slice)) {
              return true;
            }
          }

          return false;
        })
        .map((value) => Number(value))
    );
  }

  private isReportSafe(report: number[]): boolean {
    if (report.length < 2) {
      return true;
    }

    const difference = report[1] - report[0];
    if (difference === 0) {
      return false;
    }

    const checkAscending = difference < 0;

    for (let i = 1; i < report.length; i++) {
      const levelDifference = report[i] - report[i - 1];

      const absDifference = Math.abs(levelDifference);
      if (absDifference < 1 || absDifference > 3) {
        return false;
      }

      const isAscending = levelDifference < 0;
      if (checkAscending !== isAscending) {
        return false;
      }
    }

    return true;
  }
}
