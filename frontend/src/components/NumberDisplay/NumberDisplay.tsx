const formatWithCommas = (number: number, decimals: number) => {
  // Convert number to fixed string with trailing zeros
  const fixedStr = number.toFixed(decimals);
  const [integerPart, decimalPart] = fixedStr.split(".");

  // Format the integer part with commas
  const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const trimmedDecimal = decimalPart?.replace(/0+$/, "");

  // If there is a remaining decimal part, return it with a dot
  return trimmedDecimal
    ? `${integerWithCommas}.${trimmedDecimal}`
    : integerWithCommas;
};

const formatToSIUnits = (num: number, decimals: number = 1): string => {
  const SI_UNITS = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];

  const match =
    SI_UNITS.slice()
      .reverse()
      .find(({ value }) => num >= value) || SI_UNITS[0];

  return `${(num / match.value).toFixed(decimals).replace(/\.0+$/, "")}${
    match.symbol
  }`;
};

interface INumberDisplay {
  num: number | string;
  decimals?: number;
  minDecimalsForSIUnits?: number;
  minSymbolNumber?: number;
  noDecimalsAbove?: number;
  formatOutputMethod?: (num: number | string) => string;
  showAvaliableDecimals?: boolean;
}

export default function NumberDisplay({
  num,
  decimals = 2,
  minDecimalsForSIUnits = 1,
  minSymbolNumber = 1_000_000,
  noDecimalsAbove = 100_000, // Default: No decimals for numbers >= 100,000
  formatOutputMethod = (num) => num.toString(),
  showAvaliableDecimals = false,
}: INumberDisplay) {
  const parsedNum = Number.isFinite(+num) ? +num : 0;

  // If number is greater than or equal to `noDecimalsAbove`, set decimals to 0
  const adjustedDecimals =
    parsedNum >= minSymbolNumber
      ? minDecimalsForSIUnits
      : showAvaliableDecimals
      ? num.toString().split(".")[1]?.length
      : parsedNum >= noDecimalsAbove
      ? 0
      : decimals;

  const formatMethod =
    parsedNum >= minSymbolNumber ? formatToSIUnits : formatWithCommas;

  const formattedNumber = formatMethod(parsedNum, adjustedDecimals);

  const finalOutput = formatOutputMethod(formattedNumber);

  return <>{finalOutput}</>;
}
