import { getGroups } from '../../helpers/get-groups';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private readonly directions: Record<string, Point> = {
    '^': { x: -1, y: 0 },
    '>': { x: 0, y: 1 },
    v: { x: 1, y: 0 },
    '<': { x: 0, y: -1 },
  };

  solveFirst(): PuzzleResult {
    const groups = getGroups(this.input);
    const map = splitIntoLines(groups[0]).map((line) => line.split(''));
    const instructions = splitIntoLines(groups[1]).join('');

    let pos: Point | null = null;
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === '@') {
          pos = { x: i, y: j };
          map[i][j] = '.';
        }
      }
    }

    for (const instr of instructions) {
      const direction = this.directions[instr];
      const nextPos = { x: pos.x + direction.x, y: pos.y + direction.y };
      const value = map[nextPos.x][nextPos.y];

      if (value === '#') {
        continue;
      }

      if (value === '.') {
        pos = nextPos;
        continue;
      }

      let nextEmptyCell: Point | null = null;
      let tempPos = nextPos;
      while (map[tempPos.x][tempPos.y] !== '#') {
        tempPos = { x: tempPos.x + direction.x, y: tempPos.y + direction.y };
        if (map[tempPos.x][tempPos.y] === '.') {
          nextEmptyCell = tempPos;
          break;
        }
      }

      if (nextEmptyCell) {
        map[nextPos.x][nextPos.y] = '.';
        map[nextEmptyCell.x][nextEmptyCell.y] = 'O';
        pos = nextPos;
      }
    }

    let boxCoordinatesSum = 0;
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === 'O') {
          boxCoordinatesSum += 100 * i + j;
        }
      }
    }
    return boxCoordinatesSum;
  }

  solveSecond(): PuzzleResult {
    const groups = getGroups(this.input);
    const map = splitIntoLines(groups[0]).map((line) => line.split(''));
    const instructions = splitIntoLines(groups[1]).join('');

    let newMap: string[][] = [];
    for (let i = 0; i < map.length; i++) {
      const line: string[] = [];
      for (let j = 0; j < map[i].length; j++) {
        switch (map[i][j]) {
          case '@':
            line.push('@', '.');
            break;
          case 'O':
            line.push('[', ']');
            break;
          default:
            line.push(map[i][j], map[i][j]);
        }
      }
      newMap.push(line);
    }

    // for (let i = 0; i < map.length; i++) {
    //   console.log(newMap[i].join(''));
    // }

    let pos: Point | null = null;
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === '@') {
          pos = { x: i, y: j };
          map[i][j] = '.';
        }
      }
    }

    for (const instr of instructions) {
      const direction = this.directions[instr];
      const nextPos = { x: pos.x + direction.x, y: pos.y + direction.y };
      const value = map[nextPos.x][nextPos.y];

      if (value === '#') {
        continue;
      }

      if (value === '.') {
        pos = nextPos;
        continue;
      }

      // next value is a box

      if (instr === '<' || instr === '>') {
        // for horizontal instructions boxes can only move in a row so all of them are pushed. Boxes can't move other crates from other rows

        let nextEmptyCell: Point | null = null;
        let tempPos = nextPos;
        while (map[tempPos.x][tempPos.y] !== '#') {
          tempPos = { x: tempPos.x + direction.x, y: tempPos.y + direction.y };
          if (map[tempPos.x][tempPos.y] === '.') {
            nextEmptyCell = tempPos;
            break;
          }
        }

        if (nextEmptyCell) {
          map[nextPos.x][nextPos.y] = '.';
          map[nextEmptyCell.x][nextEmptyCell.y] = 'O';
          pos = nextPos;
        }
      } else {
        // for vertical instructions, the box is doubled as [ and ] so each of them can move one box
        let visitedBoxes = new Set();
        let canMoveBoxes = true;
        let boxesToMove: Point[] = [pos];
        let currBoxPosition = 0;

        while (currBoxPosition < boxesToMove.length) {
          const currentBox = boxesToMove[currBoxPosition];
        }
        //move boxes
      }
    }

    let boxCoordinatesSum = 0;
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === '[') {
          boxCoordinatesSum += 100 * i + j;
        }
      }
    }
    return boxCoordinatesSum;
  }

  private getSetKey(x: number, y: number) {
    return `${x}_${y}`;
  }
}

interface Point {
  x: number;
  y: number;
}
