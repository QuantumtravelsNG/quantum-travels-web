import { City, Country, State } from "country-state-city";

export type LocationOption = {
  label: string;
  value: string;
};

function sortByLabel(options: LocationOption[]) {
  return [...options].sort((a, b) => a.label.localeCompare(b.label));
}

function uniqueByValue(options: LocationOption[]) {
  const seen = new Set<string>();

  return options.filter((option) => {
    const normalizedValue = option.value.trim().toLowerCase();
    if (!normalizedValue || seen.has(normalizedValue)) {
      return false;
    }

    seen.add(normalizedValue);
    return true;
  });
}

export function toLocationOptions(
  options: readonly string[],
): LocationOption[] {
  return options.map((option) => ({
    label: option,
    value: option,
  }));
}

export function getCountryOptions(): LocationOption[] {
  return sortByLabel(
    Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.isoCode,
    })),
  );
}

export function getStateOptions(countryCode: string): LocationOption[] {
  if (!countryCode) return [];

  return sortByLabel(
    State.getStatesOfCountry(countryCode).map((state) => ({
      label: state.name,
      value: state.isoCode,
    })),
  );
}

export function getCityOptions(
  countryCode: string,
  stateCode: string,
): LocationOption[] {
  if (!countryCode || !stateCode) return [];

  return sortByLabel(
    uniqueByValue(
      City.getCitiesOfState(countryCode, stateCode).map((city) => ({
        label: city.name,
        value: city.name,
      })),
    ),
  );
}

export function isValidCountryCode(countryCode: string) {
  return Boolean(Country.getCountryByCode(countryCode));
}

export function isValidStateCode(countryCode: string, stateCode: string) {
  return Boolean(State.getStateByCodeAndCountry(stateCode, countryCode));
}

export function isValidCityName(
  countryCode: string,
  stateCode: string,
  cityName: string,
) {
  return City.getCitiesOfState(countryCode, stateCode).some(
    (city) => city.name === cityName,
  );
}

export function parseCountryValue(countryCode: string) {
  const trimmed = countryCode.trim();
  return Country.getCountryByCode(trimmed)?.name ?? trimmed;
}

export function parseStateValue(countryCode: string, stateCode: string) {
  const trimmedCountry = countryCode.trim();
  const trimmedState = stateCode.trim();
  return (
    State.getStateByCodeAndCountry(trimmedState, trimmedCountry)?.name ??
    trimmedState
  );
}

export function parseCityValue(
  countryCode: string,
  stateCode: string,
  cityName: string,
) {
  const trimmedCountry = countryCode.trim();
  const trimmedState = stateCode.trim();
  const trimmedCity = cityName.trim();

  return (
    City.getCitiesOfState(trimmedCountry, trimmedState).find(
      (city) => city.name === trimmedCity,
    )?.name ?? trimmedCity
  );
}

export function parseLocationValues({
  country,
  state,
  city,
}: {
  country: string;
  state: string;
  city: string;
}) {
  return {
    country: parseCountryValue(country),
    state: parseStateValue(country, state),
    city: parseCityValue(country, state, city),
  };
}
