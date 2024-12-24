import { getGroups } from '../../helpers/get-groups';
import { splitIntoLines } from '../../helpers/split-into-lines';
import Puzzle from '../../types/abstract-puzzle';
import { PuzzleResult } from '../../types/puzzle.types';

export default class ConcretePuzzle extends Puzzle {
  private valueRegistry: Record<string, boolean> = {};

  solveFirst(): PuzzleResult {
    this.valueRegistry = {};
    const groups = getGroups(this.input);

    for (const assignment of splitIntoLines(groups[0])) {
      const parts = assignment.split(': ');
      this.valueRegistry[parts[0]] = parts[1] === '1';
    }

    const rules = splitIntoLines(groups[1]).map((rule) => {
      const parts = rule.split(' ');
      return {
        operandA: parts[0],
        operandB: parts[2],
        operator: parts[1],
        resultValue: parts[4],
      } as Rule;
    });

    while (rules.length > 0) {
      let ruleIndex = 0;
      let rulesLength = rules.length;
      while (ruleIndex < rulesLength) {
        let rule = rules[ruleIndex];
        if (
          rule.operandA in this.valueRegistry &&
          rule.operandB in this.valueRegistry
        ) {
          this.executeRule(rule);
          rules.splice(ruleIndex, 1);
          rulesLength--;
          continue;
        }

        ruleIndex++;
      }
    }

    const zKeysCount = Object.keys(this.valueRegistry).filter((key) =>
      key.startsWith('z')
    ).length;

    let result = 0;
    let power = 0;
    for (let i = 0; i < zKeysCount; i++) {
      const key = i < 10 ? `z0${i}` : `z${i}`;
      if (this.valueRegistry[key]) {
        result += Math.pow(2, i);
      }
    }

    return result;
  }

  solveSecond(): PuzzleResult {
    return 'unsolved';
  }

  private executeRule(rule: Rule) {
    if (rule.operator === 'AND') {
      this.valueRegistry[rule.resultValue] =
        this.valueRegistry[rule.operandA] && this.valueRegistry[rule.operandB];
      return;
    }

    if (rule.operator === 'OR') {
      this.valueRegistry[rule.resultValue] =
        this.valueRegistry[rule.operandA] || this.valueRegistry[rule.operandB];
      return;
    }

    //XOR
    this.valueRegistry[rule.resultValue] =
      this.valueRegistry[rule.operandA] !== this.valueRegistry[rule.operandB];
  }
}

interface Rule {
  operandA: string;
  operandB: string;
  operator: 'AND' | 'OR' | 'XOR';
  resultValue: string;
}
