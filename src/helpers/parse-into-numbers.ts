export function parseIntoNumbers(input: string, separator = ' '): number[] {
  return input
    .split(separator)
    .map((line) => Number(line.trim()))
    .filter((num) => !isNaN(num));
}
