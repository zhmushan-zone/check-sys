export function toDouble(num: number): string {
  if (num < 10) {
    return "0" + num;
  }
  return "" + num;
}
