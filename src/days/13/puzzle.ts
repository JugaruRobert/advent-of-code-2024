import { getGroups } from '../../helpers/get-groups';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    return this.computeTokens(this.input);
  }

  solveSecond(): PuzzleResult {
    return this.computeTokens(this.input, 10000000000000);
  }

  private computeTokens(input: string, offset = 0) {
    const configurations = getGroups(this.input)
      .map((group) => splitIntoLines(group))
      .map(
        (lines) =>
          ({
            A: this.extractPoint(
              lines[0],
              /Button A: X\+([0-9]+), Y\+([0-9]+)/
            ),
            B: this.extractPoint(
              lines[1],
              /Button B: X\+([0-9]+), Y\+([0-9]+)/
            ),
            P: this.extractPoint(lines[2], /Prize: X=([0-9]+), Y=([0-9]+)/),
          } as Configuration)
      );

    let tokens = 0;
    for (const configuration of configurations) {
      let { A, B, P } = configuration;
      P = {
        x: P.x + offset,
        y: P.y + offset,
      };

      // Cramer's theorem
      const d = A.x * B.y - A.y * B.x;
      const da = P.x * B.y - P.y * B.x;
      const db = A.x * P.y - A.y * P.x;

      if (d === 0) {
        throw new Error(
          'Determinant is 0 => Machine has 0 or an infinite number of solutions'
        );
      } else if (da % d === 0 && db % d === 0) {
        // integer solution means correct solution
        tokens += 3 * (da / d) + db / d;
      }
    }

    return tokens;
  }

  private extractPoint(line: string, regex: RegExp) {
    const coordinates = regex
      .exec(line)
      .slice(1)
      .map((number) => parseInt(number, 10));

    return { x: coordinates[0], y: coordinates[1] };
  }
}

interface Point {
  x: number;
  y: number;
}

interface Configuration {
  A: Point;
  B: Point;
  P: Point;
}
