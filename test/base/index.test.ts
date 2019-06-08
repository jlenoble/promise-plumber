import {
  resolvableTest,
  rejectableTest,
  triggeringTest,
  cancellingTest,
  decisionTest,
  decidingTest
} from "./triggers";

import { valuePoolTest, promisePoolTest, promisePoolErrorTest } from "./pool";

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

  valueValidationWindowTest();
  promiseValidationWindowTest();
  promiseValidationWindowErrorTest();
  resumeValidationWindowTest();
});
