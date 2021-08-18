import get from "lodash/get";

export const range = (start: number, end: number, step?:number) => {
  return Array.from({length: end - start + (step||1)}, (v, k) => k + start);
};

export const descending = () => (a, b) => b - a;

export const ascending = () => (a, b) => a - b;

export const uniq = (values: any[]) => {
  return [...new Set(values)].sort();
};

export function move(array: any[], fromIndex: number, toIndex: number) {
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
}

export const sortBy = (...properties: string[]) => (nextItem, currentItem) => properties
  .map(property => {
    let dir = 1;
    if (property[0] === "-") {
      dir = -1;
      property = property.substring(1);
    }
    const path = property.split(".");
    const nextValue = get(nextItem, path);
    const currentValue = get(currentItem, path);
    return nextValue > currentValue ? dir : nextValue < currentValue ? -(dir) : 0;
  })
  .reduce((previous, next) => previous ? previous : next, 0);
