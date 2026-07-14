import { isPossiblePhoneNumber, type CountryCode } from "libphonenumber-js/min";

export function isValidPhoneNumberValue(
  value: string,
  defaultCountry: CountryCode = "NG",
) {
  return Boolean(value && isPossiblePhoneNumber(value, defaultCountry));
}
