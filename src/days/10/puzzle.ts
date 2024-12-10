import { isOutOfBounds } from '../../helpers/is-out-of-bounds';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    const map = splitIntoLines(this.input).map((line) =>
      line.split('').map((digit) => parseInt(digit))
    );
    let trailheadScores = 0;

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === 0) {
          trailheadScores += this.getTrailheadScore(map, i, j);
        }
      }
    }

    return trailheadScores;
  }

  solveSecond(): PuzzleResult {
    const map = splitIntoLines(this.input).map((line) =>
      line.split('').map((digit) => parseInt(digit))
    );
    let trailheadScores = 0;

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === 0) {
          trailheadScores += this.getTrailheadScore(map, i, j, false);
        }
      }
    }

    return trailheadScores;
  }

  private getTrailheadScore(
    map: number[][],
    i: number,
    j: number,
    unique = true
  ) {
    const visited = new Set<string>();
    const directions: Pair[] = [
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
    ];
    let queue: Pair[] = [];
    queue.push({ x: i, y: j });

    let finishedPaths = 0;

    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let pos = 0; pos < queueLength; pos++) {
        const currentPosition = queue[pos];
        const currentNumber = map[currentPosition.x][currentPosition.y];

        const key = `${currentPosition.x}_${currentPosition.y}`;
        if (unique && visited.has(key)) {
          continue;
        }

        if (currentNumber === 9) {
          finishedPaths++;
          visited.add(key);
          continue;
        }

        for (let direction of directions) {
          const newPoint = {
            x: currentPosition.x + direction.x,
            y: currentPosition.y + direction.y,
          };

          if (!isOutOfBounds(map, newPoint.x, newPoint.y)) {
            const newPointKey = `${newPoint.x}_${newPoint.y}`;
            if (
              (!unique || !visited.has(newPointKey)) &&
              map[newPoint.x][newPoint.y] === currentNumber + 1
            ) {
              queue.push(newPoint);
            }
          }
        }

        visited.add(key);
      }

      for (let pos = 0; pos < queueLength; pos++) {
        queue = queue.slice(1);
      }
    }

    return finishedPaths;
  }
}

interface Pair {
  x: number;
  y: number;
}
