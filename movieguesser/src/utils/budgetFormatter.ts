export default (budget: string) => {
  let unit = budget[0];
  let number = parseInt(budget.substring(1).replaceAll(",", ""));

  let suffixes = ["", "thousand", "million", "billion", "trillion"];

  let numZeros = Math.floor(Math.log10(Math.abs(number)) / 3);
  numZeros = numZeros > 4 ? 4 : numZeros;

  return {
    unit: unit,
    number: (number / Math.pow(10, 3 * numZeros)).toFixed(0),
    suffix: suffixes[numZeros],
  };
}