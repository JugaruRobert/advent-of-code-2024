import { getGroups } from '../../helpers/get-groups';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    const groups = getGroups(this.input);
    const schemas = groups.map((group) =>
      splitIntoLines(group).map((line) => line.split(''))
    );

    const locks: number[][] = [];
    const keys: number[][] = [];

    for (const schema of schemas) {
      const heights = [];
      if (schema[0][0] === '#') {
        for (let col = 0; col < schema[0].length; col++) {
          let height = 0;

          for (let row = 1; row < schema.length; row++) {
            if (schema[row][col] === '#') {
              height++;
            } else {
              break;
            }
          }

          heights.push(height);
        }

        locks.push(heights);
      } else {
        for (let col = 0; col < schema[0].length; col++) {
          let height = 0;

          for (let row = schema.length - 2; row >= 0; row--) {
            if (schema[row][col] === '#') {
              height++;
            } else {
              break;
            }
          }

          heights.push(height);
        }

        keys.push(heights);
      }
    }

    let matches = 0;
    const width = schemas[0][0].length;
    const height = schemas[0].length;

    for (const key of keys) {
      for (const lock of locks) {
        let isValid = true;

        for (let i = 0; i < width; i++) {
          if (lock[i] + key[i] >= height - 1) {
            isValid = false;
            break;
          }
        }

        if (isValid) {
          matches++;
        }
      }
    }

    return matches;
  }

  solveSecond(): PuzzleResult {
    return 'unsolved';
  }
}
