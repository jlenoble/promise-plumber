import {
  resolvableTest,
  rejectableTest,
  triggeringTest,
  cancellingTest
} from "./resolvable";

describe("Testing various constructs with custom Promises", (): void => {
  resolvableTest();
  rejectableTest();
  triggeringTest();
  cancellingTest();
});
