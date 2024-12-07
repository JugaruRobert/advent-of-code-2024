import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly baseOperatorFunctions = [
    (a: number, b: number) => a + b,
    (a: number, b: number) => a * b,
  ];

  solveFirst(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    let sum = 0;

    for (const line of lines) {
      const parts = line.split(': ');
      const result = parseInt(parts[0], 10);
      const numbers = parts[1].split(' ').map((number) => parseInt(number, 10));
      if (
        this.isValidEquation(
          result,
          numbers,
          this.baseOperatorFunctions,
          1,
          numbers[0]
        )
      ) {
        sum += result;
      }
    }

    return sum;
  }

  solveSecond(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    let sum = 0;
    const opFunctions = [
      ...this.baseOperatorFunctions,
      (a: number, b: number) => parseInt(a.toString().concat(b.toString())),
    ];

    for (const line of lines) {
      const parts = line.split(': ');
      const result = parseInt(parts[0], 10);
      const numbers = parts[1].split(' ').map((number) => parseInt(number, 10));
      if (this.isValidEquation(result, numbers, opFunctions, 1, numbers[0])) {
        sum += result;
      }
    }

    return sum;
  }

  private isValidEquation(
    result: number,
    numbers: number[],
    operatorFunctions: ((a: number, b: number) => number)[],
    numberIndex: number,
    currentSum: number
  ): boolean {
    if (numberIndex === numbers.length) {
      return result === currentSum;
    }

    if (currentSum > result) {
      return false;
    }

    const currentNumber = numbers[numberIndex];
    let valid = false;

    for (let opFunction of operatorFunctions) {
      valid =
        valid ||
        this.isValidEquation(
          result,
          numbers,
          operatorFunctions,
          numberIndex + 1,
          opFunction(currentSum, currentNumber)
        );
    }

    return valid;
  }
}
