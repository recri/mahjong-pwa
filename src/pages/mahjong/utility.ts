// stride generates a range of numbers
export function stride(start: number, end: number, step: number): number[] {
  const range: number[] = [];
  if (step > 0) {
    for (let x = start; x <= end; x += step) {
      range.push(x);
    }
  } else {
    for (let x = start; x >= end; x += step) {
      range.push(x);
    }
  }
  return range;
}
