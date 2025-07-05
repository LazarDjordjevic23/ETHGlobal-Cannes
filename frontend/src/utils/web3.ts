export const divideOnWei = (number: bigint | number, decimals = 18) => {
  const numAmount = typeof number === "bigint" ? Number(number) : number;
  return numAmount / 10 ** decimals;
};

export const multiplyOnWei = (number: number, decimals = 18) =>
  Math.floor(number * 10 ** decimals);
