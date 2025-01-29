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
    "(.+)\\.js": "$1",
  },
};

export default config;
