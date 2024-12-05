import { getGroups } from '../../helpers/get-groups';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  solveFirst(): PuzzleResult {
    const groups = getGroups(this.input).map((group) => splitIntoLines(group));
    const rules = groups[0];
    const updates = groups[1];

    const blacklistedPagesMap = this.getPageRulesMap(rules);
    let result = 0;

    for (const update of updates) {
      const pages = update.split(',').map((page) => parseInt(page, 10));
      if (this.isUpdateValid(pages, blacklistedPagesMap)) {
        result += pages[Math.floor(pages.length / 2)];
      }
    }

    return result;
  }

  solveSecond(): PuzzleResult {
    const groups = getGroups(this.input).map((group) => splitIntoLines(group));
    const rules = groups[0];
    const updates = groups[1];

    const blacklistedPagesMap = this.getPageRulesMap(rules, false);
    const shouldBeBeforePagesMap = this.getPageRulesMap(rules, true);

    let result = 0;

    for (const update of updates) {
      const pages = update.split(',').map((page) => parseInt(page, 10));
      if (!this.isUpdateValid(pages, blacklistedPagesMap)) {
        const fixedUpdate = this.fixInvalidUpdate(
          pages,
          shouldBeBeforePagesMap
        );
        result += fixedUpdate[Math.floor(fixedUpdate.length / 2)];
      }
    }

    return result;
  }

  private isUpdateValid(
    pages: number[],
    blacklistedPagesMap: Record<number, Set<number>>
  ) {
    const blacklistedPages = new Set<number>();
    let isValid = true;

    for (const page of pages) {
      if (blacklistedPages.has(page)) {
        isValid = false;
        return false;
      }

      if (page in blacklistedPagesMap) {
        for (const blacklistedPage of blacklistedPagesMap[page]) {
          blacklistedPages.add(blacklistedPage);
        }
      }
    }

    return true;
  }

  private getPageRulesMap(rules: string[], shouldBeBeforeOrder = false) {
    const blacklistedPagesMap: Record<number, Set<number>> = {};

    rules.forEach((rule) => {
      const pages = rule.split('|').map((page) => parseInt(page, 10));
      const firstIndex = shouldBeBeforeOrder ? 0 : 1;
      const secondIndex = shouldBeBeforeOrder ? 1 : 0;

      if (pages[firstIndex] in blacklistedPagesMap) {
        blacklistedPagesMap[pages[firstIndex]].add(pages[secondIndex]);
      } else {
        blacklistedPagesMap[pages[firstIndex]] = new Set([pages[secondIndex]]);
      }
    });

    return blacklistedPagesMap;
  }

  private fixInvalidUpdate(
    updatePages: number[],
    blacklistedPagesMap: Record<number, Set<number>>
  ) {
    let pages = [...updatePages];
    let i = 1;

    while (i < pages.length) {
      const currentPage = pages[i];

      let correctIndex = i;
      for (let j = i - 1; j >= 0; j--) {
        const page = pages[j];
        if (blacklistedPagesMap[currentPage]?.has(page)) {
          correctIndex = j;
        }
      }

      if (correctIndex !== i) {
        pages = [
          ...pages.slice(0, correctIndex),
          currentPage,
          ...pages.slice(correctIndex, i),
          ...pages.slice(i + 1),
        ];
        i = correctIndex + 1;
      } else {
        i++;
      }
    }

    return pages;
  }
}
