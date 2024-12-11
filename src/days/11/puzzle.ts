import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    return this.getNumberOfStones(25);
  }

  solveSecond(): PuzzleResult {
    return this.getNumberOfStones(75);
  }

  private getNumberOfStones(blinks: number) {
    const numbers = this.input.split(' ').map((number) => parseInt(number, 10));
    const memo: Record<string, number> = {};
    let numberOfStones = 0;

    for (let i = 0; i < numbers.length; i++) {
      numberOfStones += this.getNumberOfStonesForStone(
        numbers[i],
        blinks,
        memo
      );
    }

    return numberOfStones;
  }

  private getNumberOfStonesForStone(
    stone: number,
    blinks: number,
    memo: Record<string, number>
  ): number {
    const key = `${stone}_${blinks}`;
    if (key in memo) {
      return memo[key];
    }

    if (blinks === 0) {
      return 1;
    }

    let result = 0;
    const stoneString = stone.toString();

    if (stone === 0) {
      result = this.getNumberOfStonesForStone(1, blinks - 1, memo);
    } else if (stoneString.length % 2 === 1) {
      result = this.getNumberOfStonesForStone(stone * 2024, blinks - 1, memo);
    } else {
      const leftStone = parseInt(stoneString.slice(0, stoneString.length / 2));
      const rightStone = parseInt(stoneString.slice(stoneString.length / 2));

      result =
        this.getNumberOfStonesForStone(leftStone, blinks - 1, memo) +
        this.getNumberOfStonesForStone(rightStone, blinks - 1, memo);
    }

    memo[key] = result;
    return result;
  }
}
