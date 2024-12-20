import { splitIntoLines } from './split-into-lines';

export function parseLinesIntoNumbers(input: string): number[] {
  return splitIntoLines(input)
    .filter((line) => line.trim().length > 0)
    .map((line) => Number(line.trim()))
    .filter((num) => !isNaN(num));
}
