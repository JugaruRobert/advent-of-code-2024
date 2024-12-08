import { isOutOfBounds } from '../../helpers/is-out-of-bounds';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    return this.getAntinodesCount();
  }

  solveSecond(): PuzzleResult {
    return this.getAntinodesCount(true);
  }

  private getAntinodesCount(generateUntilOutOfBounds = false) {
    const matrix = splitIntoLines(this.input).map((line) => line.split(''));
    const visited = new Set<string>();
    const antennas: Record<string, Point[]> = {};
    let antinodesCount = 0;

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === '.') {
          continue;
        }

        const antenna = matrix[i][j];
        const sameAntennas = antennas[antenna] || [];

        for (const sameAntenna of sameAntennas) {
          let antinodePositions: Point[] = [];

          const diffX = i - sameAntenna.x;
          const diffY = j - sameAntenna.y;

          let point = {
            x: sameAntenna.x - diffX,
            y: sameAntenna.y - diffY,
          };

          while (!isOutOfBounds(matrix, point.x, point.y)) {
            antinodePositions.push(point);
            point = {
              x: point.x - diffX,
              y: point.y - diffY,
            };

            if (!generateUntilOutOfBounds) {
              break;
            }
          }

          point = {
            x: i + diffX,
            y: j + diffY,
          };

          while (!isOutOfBounds(matrix, point.x, point.y)) {
            antinodePositions.push(point);
            point = {
              x: point.x + diffX,
              y: point.y + diffY,
            };

            if (!generateUntilOutOfBounds) {
              break;
            }
          }

          if (generateUntilOutOfBounds) {
            antinodePositions.push(
              { x: sameAntenna.x, y: sameAntenna.y },
              { x: i, y: j }
            );
          }

          for (let position of antinodePositions) {
            const key = `${position.x}-${position.y}`;
            if (!visited.has(key)) {
              antinodesCount++;
              visited.add(key);
            }
          }
        }

        antennas[antenna] = [
          ...sameAntennas,
          {
            x: i,
            y: j,
          },
        ];
      }
    }

    return antinodesCount;
  }
}

interface Point {
  x: number;
  y: number;
}
