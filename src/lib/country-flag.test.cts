/* eslint-disable @typescript-eslint/no-require-imports -- Node runs this TypeScript test directly as CommonJS. */
const assert = require("node:assert/strict");
const { test } = require("node:test");
const { regionalIndicatorToCountryCode } =
  require("./country-flag.ts") as typeof import("./country-flag");

test("converts regional indicator flags to country codes", () => {
  assert.equal(regionalIndicatorToCountryCode("🇸🇬"), "SG");
  assert.equal(regionalIndicatorToCountryCode("🇶🇦"), "QA");
  assert.equal(regionalIndicatorToCountryCode("Singapore"), null);
});
