import { isOutOfBounds } from '../../helpers/is-out-of-bounds';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly directions: Point[] = [
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
  ];

  solveFirst(): PuzzleResult {
    const matrix = splitIntoLines(this.input).map((line) => line.split(''));
    const visited = new Set<string>();
    let result = 0;

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const key = this.generateKey(i, j);
        if (!visited.has(key)) {
          result += this.computeAreaPerimeterResult(
            matrix,
            { x: i, y: j },
            visited
          );
        }
      }
    }
    return result;
  }

  solveSecond(): PuzzleResult {
    const matrix = splitIntoLines(this.input).map((line) => line.split(''));
    const visited = new Set<string>();
    let result = 0;

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const key = this.generateKey(i, j);
        if (!visited.has(key)) {
          result += this.computeAreaSidesResult(
            matrix,
            { x: i, y: j },
            visited
          );
        }
      }
    }
    return result;
  }

  private computeAreaPerimeterResult(
    matrix: string[][],
    point: Point,
    visited: Set<string>
  ) {
    let queue: Point[] = [];
    queue.push(point);

    let area = 0;
    let perimeter = 0;

    while (queue.length > 0) {
      const point = queue[0];
      const pointKey = this.generateKey(point.x, point.y);

      if (!visited.has(pointKey)) {
        visited.add(pointKey);

        area += 1;

        for (const direction of this.directions) {
          const newPoint = {
            x: point.x + direction.x,
            y: point.y + direction.y,
          };
          const key = this.generateKey(newPoint.x, newPoint.y);

          if (
            this.isPointConnected(matrix, newPoint, matrix[point.x][point.y])
          ) {
            if (!visited.has(key)) {
              queue.push(newPoint);
            }
          } else {
            perimeter++;
          }
        }
      }

      queue = queue.slice(1);
    }

    return area * perimeter;
  }

  private computeAreaSidesResult(
    matrix: string[][],
    point: Point,
    visited: Set<string>
  ) {
    let queue: Point[] = [];
    queue.push(point);

    let area = 0;
    let perimeter = 0;

    while (queue.length > 0) {
      const point = queue[0];
      const pointKey = this.generateKey(point.x, point.y);

      if (!visited.has(pointKey)) {
        visited.add(pointKey);

        area += 1;
        perimeter += this.getNumberOfCorners(matrix, point);

        for (const direction of this.directions) {
          const newPoint = {
            x: point.x + direction.x,
            y: point.y + direction.y,
          };
          const key = this.generateKey(newPoint.x, newPoint.y);

          if (
            this.isPointConnected(matrix, newPoint, matrix[point.x][point.y])
          ) {
            if (!visited.has(key)) {
              queue.push(newPoint);
            }
          }
        }
      }

      queue = queue.slice(1);
    }

    return area * perimeter;
  }

  private getNumberOfCorners(matrix: string[][], point: Point) {
    return (
      this.getNumberOfInnerCorners(matrix, point) +
      this.getNumberOfOuterCorners(matrix, point)
    );
  }

  private getNumberOfInnerCorners(matrix: string[][], point: Point) {
    const value = matrix[point.x][point.y];
    let corners = 0;

    const topPoint = { x: point.x - 1, y: point.y };
    const rightPoint = { x: point.x, y: point.y + 1 };
    const bottomPoint = { x: point.x + 1, y: point.y };
    const leftPoint = { x: point.x, y: point.y - 1 };

    const pairs = [
      [topPoint, rightPoint],
      [topPoint, leftPoint],
      [bottomPoint, rightPoint],
      [bottomPoint, leftPoint],
    ];

    for (const pair of pairs) {
      if (
        !this.isPointConnected(matrix, pair[0], value) &&
        !this.isPointConnected(matrix, pair[1], value)
      ) {
        corners++;
      }
    }

    return corners;
  }

  private getNumberOfOuterCorners(matrix: string[][], point: Point) {
    const value = matrix[point.x][point.y];
    let corners = 0;

    const topPoint = { x: point.x - 1, y: point.y };
    const rightPoint = { x: point.x, y: point.y + 1 };
    const bottomPoint = { x: point.x + 1, y: point.y };
    const leftPoint = { x: point.x, y: point.y - 1 };

    const pairs = [
      [topPoint, rightPoint],
      [topPoint, leftPoint],
      [bottomPoint, rightPoint],
      [bottomPoint, leftPoint],
    ];

    for (const pair of pairs) {
      const cornerPoint = {
        x: pair[0].x + pair[1].x - point.x,
        y: pair[0].y + pair[1].y - point.y,
      };
      if (
        this.isPointConnected(matrix, pair[0], value) &&
        this.isPointConnected(matrix, pair[1], value) &&
        !this.isPointConnected(matrix, cornerPoint, value)
      ) {
        corners++;
      }
    }

    return corners;
  }

  private isPointConnected(matrix: string[][], point: Point, value: string) {
    return (
      !isOutOfBounds(matrix, point.x, point.y) &&
      matrix[point.x][point.y] === value
    );
  }

  private generateKey(x: number, y: number) {
    return `${x}_${y}`;
  }
}

interface Point {
  x: number;
  y: number;
}
