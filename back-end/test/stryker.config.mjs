// https://stryker-mutator.io/docs/stryker-js/configuration/
// https://stryker-mutator.io/docs/stryker-js/mocha-runner

const config = {
  mutate: [
    "api/services/**/*.js",
    "api/controllers/**/*.js",
    // "api/models/**/*.js",
  ],
  packageManager: "npm",
  reporters: ["html", "progress"],
  coverageAnalysis: "perTest",
  testRunner: "mocha",
  mochaOptions: {
    spec: ["test/unit/**/*.test.js"],
    ui: "tdd",
    config: "test/unit/.mocharc.js",
  },
  htmlReporter: {
    fileName: "test/mutation/index.html",
  },
  incremental: true,
};
export default config;
