import {
  resolvableTest,
  rejectableTest,
  triggeringTest,
  cancellingTest,
  decisionTest,
  decidingTest
} from "./triggers";

import {
  valuePoolTest,
  promisePoolTest,
  promisePoolErrorTest,
  valueSinkTest,
  promiseSinkTest,
  promiseSinkErrorTest
} from "./pools";

import {
  valueValidationWindowTest,
  promiseValidationWindowTest,
  promiseValidationWindowErrorTest,
  resumeValidationWindowTest
} from "./windows";

describe("Testing various constructs with custom Promises", (): void => {
  resolvableTest();
  rejectableTest();
  triggeringTest();
  cancellingTest();
  decisionTest();
  decidingTest();

  valuePoolTest();
  promisePoolTest();
  promisePoolErrorTest();
  valueSinkTest();
  promiseSinkTest();
  promiseSinkErrorTest();

  valueValidationWindowTest();
  promiseValidationWindowTest();
  promiseValidationWindowErrorTest();
  resumeValidationWindowTest();
});
