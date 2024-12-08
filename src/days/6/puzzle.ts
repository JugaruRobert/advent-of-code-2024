import { isOutOfBounds } from '../../helpers/is-out-of-bounds';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    const map = splitIntoLines(this.input).map((line) => line.split(''));
    let point = this.getStartingPosition(map);
    const visited = new Set<string>();
    let positionCount = 0;

    while (true) {
      const key = this.createKeyFromPoint(point);
      if (visited.has(key)) {
        break;
      }

      visited.add(key);

      if (map[point.position.x][point.position.y] !== 'X') {
        positionCount++;
      }

      map[point.position.x][point.position.y] = 'X';

      const nextX = point.position.x + point.direction.x;
      const nextY = point.position.y + point.direction.y;

      if (isOutOfBounds(map, nextX, nextY)) {
        break;
      }

      if (map[nextX][nextY] === '#') {
        point = { ...point, direction: this.getNextDirection(point.direction) };
      } else {
        point = { ...point, position: { x: nextX, y: nextY } };
      }
    }

    return positionCount;
  }

  solveSecond(): PuzzleResult {
    const map = splitIntoLines(this.input).map((line) => line.split(''));
    const initialMap = structuredClone(map);
    let point = this.getStartingPosition(map);
    const startingPoint = structuredClone(point);
    const visited = new Set<string>();
    let positionCount = 0;

    while (true) {
      const key = this.createKeyFromPoint(point);
      if (visited.has(key)) {
        break;
      }

      visited.add(key);

      const isStartingPoint =
        point.position.x === startingPoint.position.x &&
        point.position.y === startingPoint.position.y;
      if (map[point.position.x][point.position.y] !== 'X' && !isStartingPoint) {
        const mapCopy = structuredClone(initialMap);
        mapCopy[point.position.x][point.position.y] = '#';
        if (this.isCycle(mapCopy, startingPoint)) {
          positionCount++;
        }
      }

      map[point.position.x][point.position.y] = 'X';

      const nextX = point.position.x + point.direction.x;
      const nextY = point.position.y + point.direction.y;

      if (this.isOutOfBounds(map, nextX, nextY)) {
        break;
      }

      if (map[nextX][nextY] === '#') {
        point = { ...point, direction: this.getNextDirection(point.direction) };
      } else {
        point = { ...point, position: { x: nextX, y: nextY } };
      }
    }

    return positionCount;
  }

  private isCycle(map: string[][], point: Point) {
    const visited = new Set<string>();

    while (true) {
      const key = this.createKeyFromPoint(point);
      if (visited.has(key)) {
        return true;
      }

      visited.add(key);

      const nextX = point.position.x + point.direction.x;
      const nextY = point.position.y + point.direction.y;

      if (this.isOutOfBounds(map, nextX, nextY)) {
        return false;
      }

      if (map[nextX][nextY] === '#') {
        point = { ...point, direction: this.getNextDirection(point.direction) };
      } else {
        point = { ...point, position: { x: nextX, y: nextY } };
      }
    }

    return false;
  }

  private getStartingPosition(map: string[][]): Point {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        switch (map[i][j]) {
          case '^':
            return { position: { x: i, y: j }, direction: { x: -1, y: 0 } };
          case '>':
            return { position: { x: i, y: j }, direction: { x: 0, y: 1 } };
          case 'v':
            return { position: { x: i, y: j }, direction: { x: 1, y: 0 } };
          case '<':
            return { position: { x: i, y: j }, direction: { x: 0, y: -1 } };
        }
      }
    }
  }

  private createKeyFromPoint(point: Point) {
    return `${point.position.x}-${point.position.y}-${point.direction.x}-${point.direction.y}`;
  }

  private isOutOfBounds(map: string[][], x: number, y: number) {
    return x < 0 || x >= map.length || y < 0 || y > map[x].length;
  }

  private getNextDirection(direction: Pair) {
    if (direction.x === -1 && direction.y === 0) {
      return { x: 0, y: 1 };
    }

    if (direction.x === 0 && direction.y === 1) {
      return { x: 1, y: 0 };
    }

    if (direction.x === 1 && direction.y === 0) {
      return { x: 0, y: -1 };
    }

    if (direction.x === 0 && direction.y === -1) {
      return { x: -1, y: 0 };
    }

    return;
  }
}

interface Pair {
  x: number;
  y: number;
}

interface Point {
  position: Pair;
  direction: Pair;
}
