import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    const { firstList, secondList } = this.readLists(lines);

    firstList.sort();
    secondList.sort();

    let result = 0;
    for (let i = 0; i < firstList.length; i++) {
      result += Math.abs(firstList[i] - secondList[i]);
    }

    return result;
  }

  solveSecond(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    const { firstList, secondList } = this.readLists(lines);
    const frequencies = this.computeFrequences(secondList);

    let result = 0;
    firstList.forEach((element) => {
      result += element * (frequencies[element] ?? 0);
    });

    return result;
  }

  private readLists(lines: string[]) {
    const firstList: number[] = [];
    const secondList: number[] = [];

    lines.forEach((line) => {
      const elements = line
        .split(' ')
        .filter(Boolean)
        .map((element) => parseInt(element, 10));

      firstList.push(elements[0]);
      secondList.push(elements[1]);
    });

    return { firstList, secondList };
  }

  private computeFrequences(list: number[]) {
    const frequencies: Record<number, number> = {};
    list.forEach((element) => {
      frequencies[element] = (frequencies[element] ?? 0) + 1;
    });
    return frequencies;
  }
}
