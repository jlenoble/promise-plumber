import { resolvableTest, rejectableTest } from "./resolvable";
import {
  triggerableTest,
  cancelableTest,
  interruptibleTest
} from "./triggerable";

describe("Testing various constructs with native Promises", (): void => {
  resolvableTest();
  rejectableTest();
  triggerableTest();
  cancelableTest();
  interruptibleTest();
});
