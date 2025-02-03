const chai = require("chai");
const sinon = require("sinon");
const { test, suite, setup, teardown } = require("mocha");

/*
General recomendation:
If other models must be called from the one being tested, I strongly
recommend to extract the behaviour to a service module and inject
the relevant model dependencies there. Otherwise, testing here is
almost impossible, as models are global variables instead of being 
required and sinon nor proxyquire can't be used. 
The only alternative is to use another library, rewire, which performs 
"monkey patching" (i.e. changes code behaviour at runtime) and allows 
to overwrite requires and global variables. This can lead to unexpected
behaviour. It also fosters violating encapsulation and may create
brittle tests. If possible, don't use it.

Sources:
* https://www.npmjs.com/package/rewire
* https://www.audero.it/blog/2016/12/05/monkey-patching-javascript/
* https://en.wikipedia.org/wiki/Monkey_patch#Pitfalls
* https://github.com/thlorenz/proxyquire/issues/90#issuecomment-178056535
* https://sailsjs.com/documentation/concepts/models-and-orm/models#?what-about-instance-methods
*/

suite("ToDo", function () {
  let ToDo, logStub;

  setup(function () {
    ToDo = require("../../../api/models/ToDo");
  });

  teardown(function () {
    sinon.restore();
  });

  test("sayHi", function () {
    logStub = sinon.stub(console, "log").callsFake(() => {
      /* Don't log anything */
    });

    ToDo.sayHi();

    const arg = logStub.getCall(0).args[0].toLowerCase();
    chai.assert(logStub.calledOnce);
    chai.assert(arg.includes("hi"));
  });
});
