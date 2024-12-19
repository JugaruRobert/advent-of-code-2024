import { getGroups } from '../../helpers/get-groups';
import { numberSum } from '../../helpers/number-sum';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    const groups = getGroups(this.input);
    const patterns = groups[0].split(', ');
    const designs = splitIntoLines(groups[1]);
    const cache: Record<string, boolean> = {};

    return numberSum(
      designs
        .map((design) => this.isDesignPossible(design, patterns, cache))
        .map((value) => (value ? 1 : 0))
    );
  }

  solveSecond(): PuzzleResult {
    const groups = getGroups(this.input);
    const patterns = groups[0].split(', ');
    const designs = splitIntoLines(groups[1]);
    const cache: Record<string, number> = {};

    return numberSum(
      designs.map((design) =>
        this.getCountOfAllPossibleDesignArrangements(design, patterns, cache)
      )
    );
  }

  private isDesignPossible(
    design: string,
    patterns: string[],
    cache: Record<string, boolean>
  ): boolean {
    if (design in cache) {
      return cache[design];
    }

    if (design === '') {
      return true;
    }

    let isPossible = false;
    for (const pattern of patterns) {
      if (design.startsWith(pattern)) {
        isPossible =
          isPossible ||
          this.isDesignPossible(design.slice(pattern.length), patterns, cache);
      }
    }

    cache[design] = isPossible;
    return isPossible;
  }

  private getCountOfAllPossibleDesignArrangements(
    design: string,
    patterns: string[],
    cache: Record<string, number>
  ): number {
    if (design in cache) {
      return cache[design];
    }

    if (design === '') {
      return 1;
    }

    let arrangements = 0;
    for (const pattern of patterns) {
      if (design.startsWith(pattern)) {
        arrangements += this.getCountOfAllPossibleDesignArrangements(
          design.slice(pattern.length),
          patterns,
          cache
        );
      }
    }

    cache[design] = arrangements;
    return arrangements;
  }
}
