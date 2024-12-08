export function isOutOfBounds<T>(matrix: T[][], x: number, y: number): boolean {
  return x < 0 || x >= matrix.length || y < 0 || y >= matrix[x].length;
}
