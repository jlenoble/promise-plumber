import { resolvableTest, rejectableTest } from "./resolvable";

describe("Testing various constructs with native Promises", (): void => {
  resolvableTest();
  rejectableTest();
});
