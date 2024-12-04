import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    const regex = /mul\(\d+,\d+\)/g;
    const groupMatches = this.input.match(regex);

    let result = 0;
    groupMatches.forEach((groupMatch) => {
      const numbers = groupMatch.match(/\d+/g).map((number) => Number(number));
      result += numbers[0] * numbers[1];
    });
    return result;
  }

  solveSecond(): PuzzleResult {
    const regex = /mul\(\d+,\d+\)|do\(\)|don't\(\)/g;
    const matches = [...this.input.matchAll(regex)].map((array) => array[0]);

    let result = 0;
    let isValid = true;

    for (const match of matches) {
      if (match === 'do()') {
        isValid = true;
        continue;
      }

      if (match === "don't()") {
        isValid = false;
        continue;
      }

      if (isValid) {
        const numbers = match.match(/\d+/g).map((number) => Number(number));
        result += numbers[0] * numbers[1];
      }
    }

    return result;
  }
}
