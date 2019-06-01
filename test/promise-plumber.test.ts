import { expect } from "chai";
import PromisePlumber from "../src/promise-plumber";

describe("Testing PromisePlumber", (): void => {
  const defaultArgs = [];

  it("Class PromisePlumber can be instanciated", (): void => {
    expect(
      (): void => {
        new PromisePlumber(...defaultArgs);
      }
    ).not.to.throw();
  });
});
