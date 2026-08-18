import type { Country } from "react-phone-number-input";

const REGIONAL_INDICATOR_START = 0x1f1e6;
const REGIONAL_INDICATOR_END = 0x1f1ff;
const COUNTRY_CODE_OFFSET = REGIONAL_INDICATOR_START - "A".charCodeAt(0);

export function regionalIndicatorToCountryCode(value: string): Country | null {
  const indicators = Array.from(value.trim());
  if (indicators.length !== 2) return null;

  const codePoints = indicators.map(
    (indicator) => indicator.codePointAt(0) ?? 0,
  );
  if (
    codePoints.some(
      (codePoint) =>
        codePoint < REGIONAL_INDICATOR_START ||
        codePoint > REGIONAL_INDICATOR_END,
    )
  )
    return null;

  return String.fromCharCode(
    ...codePoints.map((codePoint) => codePoint - COUNTRY_CODE_OFFSET),
  ) as Country;
}
