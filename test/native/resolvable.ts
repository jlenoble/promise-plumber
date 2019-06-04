import { expect } from "chai";
import immediate from "../helpers/immediate";
import LooseObject from "../helpers/loose-object";

export const resolvableTest = (): ReturnType<typeof it> =>
  it("Resolving a Promise explicitly", async (): Promise<void> => {
    const value = {};

    const p: LooseObject = new Promise(
      (resolve): void => {
        immediate().then(
          (): void => {
            Object.defineProperty(p, "resolve", {
              value: (v: object): void => resolve(v)
            });
          }
        );
      }
    );

    immediate(value).then((v): void => p.resolve(v));

    const result = await p;

    expect(result).to.equal(value);
  });

export const rejectableTest = (): ReturnType<typeof it> =>
  it("Rejecting a Promise explicitly", async (): Promise<void> => {
    const error = new Error("Rejected explicitly as expected");
    const error2 = new Error("Failed to reject predictibly");

    const p: LooseObject = new Promise(
      (resolve, reject): void => {
        immediate().then(
          (): void => {
            Object.defineProperty(p, "resolve", {
              value: (v: object): void => resolve(v)
            });
            Object.defineProperty(p, "reject", {
              value: (e: Error): void => reject(e)
            });
          }
        );
      }
    );

    immediate(error).then((e): void => p.reject(e));

    try {
      await p;
      throw error2;
    } catch (e) {
      expect(e).to.equal(error);
    }
  });
