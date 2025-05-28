export function createPairs<T>(array: T[]): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      result.push([array[i], array[j]]);
    }
  }
  return result;
}