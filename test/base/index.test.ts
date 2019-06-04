import { resolvableTest, rejectableTest, triggeringTest } from "./resolvable";

describe("Testing various constructs with custom Promises", (): void => {
  resolvableTest();
  rejectableTest();
  triggeringTest();
});
