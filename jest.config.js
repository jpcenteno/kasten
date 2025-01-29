const config = {
  preset: "ts-jest",
  testEnvironment: "node", // Use 'jsdom' if you're testing browser-like code
  testMatch: [
    "**/packages/**/?(*.)+(spec|test).ts", // Look for *.test.ts or *.spec.ts files in the packages
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {
    // We need to remove `.js` suffix from the module specifiers for Jest to be
    // able to resolve imported modules. See [1], [2].
    //
    // [1] https://www.typescriptlang.org/docs/handbook/modules/theory.html#module-resolution-for-libraries
    // [2] https://github.com/kulshekhar/ts-jest/issues/1057
    "(.+)\\.js": "$1",
  },
};

export default config;
