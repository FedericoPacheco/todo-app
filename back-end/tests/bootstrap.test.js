const sails = require("sails");
const { run } = require("mocha");

// Documentation:
// https://sailsjs.com/documentation/concepts/testing
// https://mochajs.org/#root-hook-plugins
// https://testrigor.com/sails-js-testing/#mocha

// https://stackoverflow.com/questions/39739144/mocha-before-doesnt-execute-before-as-expected

// Doesn't work (see similar (if not the same) issue here: https://github.com/mochajs/mocha/issues/5006)
// On the other side it isn't necessary. It's enough to lift the service with: docker compose up --build  and from host's terminal do: npm test
exports.mochaHooks = {
  beforeAll(done) {
    // this.timeout(5000);
    console.log("Starting Sails...");
    sails.lift(
      {
        environment: "test",
        hooks: { grunt: false },
        log: { level: "warn" },
      },
      function (err) {
        if (err) {
          console.log("Error starting Sails:", err);
          return done(err);
        }
        console.log("Sails started.");
        return done();
      }
    );

    run();
  },
  afterAll(done) {
    console.log("Stopping Sails...");
    sails.lower(done);
  },
};
