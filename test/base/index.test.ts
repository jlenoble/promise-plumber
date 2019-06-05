import {
  resolvableTest,
  rejectableTest,
  triggeringTest,
  cancellingTest,
  decisionTest,
  decidingTest
} from "./triggers";

describe("Testing various constructs with custom Promises", (): void => {
  resolvableTest();
  rejectableTest();
  triggeringTest();
  cancellingTest();
  decisionTest();
  decidingTest();
});
