export function localMinimums<T>(array: T[], evalFunction: (element: T) => number): T[] {
    if (array.length == 0) {
        return [];
    }
    if (array.length == 1) {
        return [...array];
    }

    const length = array.length;
    const results: T[] = new Array();

    if (evalFunction(array[0]) < evalFunction(array[1])) {
        results.push(array[0]);
    }

    for (let i = 1; i <= length - 2; i++) {
        if (evalFunction(array[i - 1]) > evalFunction(array[i])
            && evalFunction(array[i + 1]) > evalFunction(array[i])) {
            results.push(array[i]);
        }
    }

    if (evalFunction(array[length - 2]) > evalFunction(array[length - 1])) {
        results.push(array[length - 1]);
    }

    return results;
}
