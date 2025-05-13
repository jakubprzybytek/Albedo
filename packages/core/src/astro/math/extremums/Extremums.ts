export type Extremums<T> = {
  minimums: T[],
  maximums: T[]
}

export function localExtremums<T>(array: T[], evalFunction: (element: T) => number): Extremums<T> {
  if (array.length < 2) {
    return { minimums: [], maximums: [] };
  }
  // if (array.length == 1) {
  //   return { minimums: [...array], maximums: [...array] };
  // }

  const length = array.length;
  const minimums: T[] = new Array();
  const maximums: T[] = new Array();

  // if (evalFunction(array[0]) < evalFunction(array[1])) {
  //   minimums.push(array[0]);
  // } else if (evalFunction(array[0]) > evalFunction(array[1])) {
  //   maximums.push(array[0]);
  // }

  var previousValue;
  var currentValue = evalFunction(array[0]);
  var nextValue = evalFunction(array[1]);
  for (let i = 1; i <= length - 2; i++) {
    previousValue = currentValue;
    currentValue = nextValue;
    nextValue = evalFunction(array[i + 1]);
    if (previousValue > currentValue && nextValue > currentValue) {
      minimums.push(array[i]);
    } else if (previousValue < currentValue && nextValue < currentValue) {
      maximums.push(array[i]);
    }
  }

  // if (evalFunction(array[length - 2]) > evalFunction(array[length - 1])) {
  //   minimums.push(array[length - 1]);
  // } else if (evalFunction(array[length - 2]) < evalFunction(array[length - 1])) {
  //   maximums.push(array[length - 1]);
  // }

  return {
    minimums: minimums,
    maximums: maximums
  };
}
