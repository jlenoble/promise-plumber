import { expect } from "chai";
import Trigger, { Canceller } from "../../src/base/trigger";
import { repeatN } from "../../src/helpers/repeat";

export const resolvableTest = (): ReturnType<typeof it> =>
  it("Testing a Trigger", async (): Promise<void> => {
    const trigger = new Trigger();

    trigger.resolve(1);
    trigger.resolve(2);
    trigger.resolve(3);

    const result = await trigger;

    expect(result).to.equal(1);
  });

export const triggeringTest = (): ReturnType<typeof it> =>
  it("Triggering promises", async (): Promise<void> => {
    const trigger = new Trigger();

    const p1 = trigger.then((): number => 1);
    const p2 = trigger.then((): number => 2);
    const p3 = trigger.then((): number => 3);

    const p = Promise.all([p1, p2, p3]);
    let counter = 5;

    const r = repeatN(async (): Promise<number[]> => {
      counter--;
      return p;
    }, counter);

    try {
      expect(counter).to.equal(5);

      trigger.resolve("resolved");
      expect(counter).to.equal(5);

      expect(await trigger).to.equal("resolved");
      expect(counter).not.to.equal(0);

      expect(await p).to.eql([1, 2, 3]);
      expect(counter).not.to.equal(0);

      expect(await r).to.eql([1, 2, 3]);
      expect(counter).to.equal(0);
    } catch (e) {
      await r;
      throw e;
    }

    return r;
  });

export const rejectableTest = (): ReturnType<typeof it> =>
  it("Testing a Canceller", async (): Promise<void> => {
    const trigger = new Canceller();

    trigger.reject(new Error("Error 1"));
    trigger.reject(new Error("Error 2"));
    trigger.reject(new Error("Error 3"));

    try {
      await trigger;
      throw new Error("Error 4");
    } catch (e) {
      expect(e.message).to.equal("Error 1");
    }
  });
