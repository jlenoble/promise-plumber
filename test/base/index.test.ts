import {
  resolvableTest,
  rejectableTest,
  triggeringTest,
  cancellingTest,
  decisionTest,
  decidingTest
} from "./triggers";

import { valuePoolTest, promisePoolTest, promisePoolErrorTest } from "./pool";

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
});
