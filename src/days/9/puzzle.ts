import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    const diskMap = this.input.split('').map((digit) => parseInt(digit));
    let checksum = 0;

    if (diskMap.length % 2 !== 0) {
      diskMap.slice(0, diskMap.length - 1);
    }

    let leftId = 0;
    let leftMapIndex = 0;
    let rightMapIndex = diskMap.length - 1;
    let position = 0;

    while (leftMapIndex < diskMap.length) {
      if (leftMapIndex % 2 === 0) {
        while (diskMap[leftMapIndex] > 0) {
          checksum += position * leftId;
          diskMap[leftMapIndex]--;
          position++;
        }

        leftId++;
      } else {
        while (diskMap[leftMapIndex] > 0 && rightMapIndex > 0) {
          while (diskMap[rightMapIndex] === 0) {
            rightMapIndex -= 2;
          }

          if (rightMapIndex > 0) {
            const rightId = rightMapIndex / 2;
            checksum += position * rightId;
            diskMap[rightMapIndex]--;
            diskMap[leftMapIndex]--;
            position++;
          }
        }
      }

      leftMapIndex++;
    }

    return checksum;
  }

  solveSecond(): PuzzleResult {
    const diskMap = this.input.split('').map((digit) => parseInt(digit));
    const diskMapClone = structuredClone(diskMap);

    let checksum = 0;
    let visited = new Set<number>();

    if (diskMap.length % 2 !== 0) {
      diskMap.slice(0, diskMap.length - 1);
    }

    let leftId = 0;
    let leftMapIndex = 0;
    let position = 0;

    while (leftMapIndex < diskMap.length) {
      if (leftMapIndex % 2 === 0) {
        if (visited.has(leftMapIndex)) {
          position += diskMapClone[leftMapIndex];
        }

        while (diskMap[leftMapIndex] > 0) {
          checksum += position * leftId;
          diskMap[leftMapIndex]--;
          position++;
        }

        leftId++;
      } else {
        let rightMapIndex = diskMap.length - 1;
        while (diskMap[leftMapIndex] > 0 && rightMapIndex > 0) {
          while (diskMap[rightMapIndex] === 0) {
            rightMapIndex -= 2;
          }

          if (rightMapIndex > 0) {
            if (diskMap[rightMapIndex] <= diskMap[leftMapIndex]) {
              const rightId = rightMapIndex / 2;
              checksum += position * rightId;

              visited.add(rightMapIndex);

              diskMap[rightMapIndex]--;
              diskMap[leftMapIndex]--;
              position++;
            } else {
              rightMapIndex -= 2;
            }
          }
        }

        position += diskMap[leftMapIndex];
      }

      leftMapIndex++;
    }

    return checksum;
  }
}
