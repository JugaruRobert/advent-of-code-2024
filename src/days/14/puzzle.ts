import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly gridWidth = 101;
  private readonly gridHeight = 103;
  private readonly midWidth = Math.floor(this.gridWidth / 2);
  private readonly midHeight = Math.floor(this.gridHeight / 2);

  solveFirst(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    const quadrants = [0, 0, 0, 0];
    const seconds = 100;

    for (const line of lines) {
      const point = this.extractPoint(line, /p=([0-9]+),([0-9]+)/);
      const velocity = this.extractPoint(line, /v=(-?[0-9]+),(-?[0-9]+)/);

      let resX = (point.x + seconds * velocity.x) % this.gridHeight;
      let resY = (point.y + seconds * velocity.y) % this.gridWidth;

      if (resX < 0) {
        resX += this.gridHeight;
      }

      if (resY < 0) {
        resY += this.gridWidth;
      }

      if (resX === this.midHeight || resY === this.midWidth) {
        continue;
      }

      if (resX < this.midHeight) {
        if (resY < this.midWidth) {
          quadrants[0]++;
        } else {
          quadrants[1]++;
        }
      } else {
        if (resY < this.midWidth) {
          quadrants[2]++;
        } else {
          quadrants[3]++;
        }
      }
    }

    return quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3];
  }

  solveSecond(): PuzzleResult {
    const lines = splitIntoLines(this.input);
    let maxNumberNeighbours = 0;
    let secondWithMaxNumberNeighbours = 0;
    let uniquePositionsSet = new Set<string>();

    for (let second = 1; second < 10000; second++) {
      const uniquePositions = new Set<string>();

      for (const line of lines) {
        const point = this.extractPoint(line, /p=([0-9]+),([0-9]+)/);
        const velocity = this.extractPoint(line, /v=(-?[0-9]+),(-?[0-9]+)/);

        let resX = (point.x + second * velocity.x) % this.gridHeight;
        let resY = (point.y + second * velocity.y) % this.gridWidth;

        if (resX < 0) {
          resX += this.gridHeight;
        }

        if (resY < 0) {
          resY += this.gridWidth;
        }

        const key = `${resX}_${resY}`;
        uniquePositions.add(key);
      }

      const numberNeighbours =
        this.computeTotalNumberNeighbours(uniquePositions);
      if (numberNeighbours > maxNumberNeighbours) {
        maxNumberNeighbours = numberNeighbours;
        secondWithMaxNumberNeighbours = second;
        uniquePositionsSet = uniquePositions;
      }
    }

    this.printTree(uniquePositionsSet);
    return secondWithMaxNumberNeighbours;
  }

  private extractPoint(line: string, regex: RegExp) {
    const coordinates = regex
      .exec(line)
      .slice(1)
      .map((number) => parseInt(number, 10));

    // row and col indexes are reversed
    return { x: coordinates[1], y: coordinates[0] };
  }

  private computeTotalNumberNeighbours(robotPositions: Set<string>) {
    const positions = [...robotPositions.values()].map((position) =>
      position.split('_').map((number) => parseInt(number))
    );

    let totalNeighbours = 0;

    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ];
    for (const position of positions) {
      for (const direction of directions) {
        const newPosition = [
          position[0] + direction[0],
          position[1] + direction[1],
        ];
        const key = `${newPosition[0]}_${newPosition[1]}`;

        if (
          !this.isOutOfBounds(newPosition[0], newPosition[1]) &&
          robotPositions.has(key)
        ) {
          totalNeighbours++;
        }
      }
    }

    return totalNeighbours;
  }

  private isOutOfBounds(x: number, y: number): boolean {
    return x < 0 || x >= this.gridHeight || y < 0 || y >= this.gridWidth;
  }

  private printTree(robotPositions: Set<string>) {
    for (let i = 0; i < this.gridHeight; i++) {
      for (let j = 0; j < this.gridWidth; j++) {
        const key = `${i}_${j}`;
        process.stdout.write(robotPositions.has(key) ? '#' : '.');
      }
      console.log('');
    }
  }
}
