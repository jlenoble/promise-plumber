import { expect } from "chai";
import { Trigger, Deadline, Decision } from "../../src/base/triggers";
import { repeatN } from "../../src/helpers/repeat";

describe("Testing Trigger classes", (): void => {
  it("Testing a Trigger", async (): Promise<void> => {
    const trigger = new Trigger();

    trigger.resolve(1);
    trigger.resolve(2);
    trigger.resolve(3);

    const result = await trigger;

    expect(result).to.equal(1);
  });

  it("Starting promises", async (): Promise<void> => {
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

  it("Testing a Deadline", async (): Promise<void> => {
    const trigger = new Deadline();

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

  it("Cancelling promises", async (): Promise<void> => {
    const trigger = new Deadline();

    const p1 = trigger.then((): number => 1, (): number => 4);
    const p2 = trigger.then((): number => 2, (): number => 5);
    const p3 = trigger.then((): number => 3, (): number => 6);

    const p = Promise.all([p1, p2, p3]);
    let counter = 5;

    const r = repeatN(async (): Promise<number[]> => {
      counter--;
      return p;
    }, counter);

    try {
      expect(counter).to.equal(5);

      trigger.reject(new Error("rejected"));
      expect(counter).to.equal(5);

      try {
        await trigger;
      } catch (e) {
        expect(e.message).to.equal("rejected");
        expect(counter).not.to.equal(0);
      }

      expect(await p).to.eql([4, 5, 6]);
      expect(counter).not.to.equal(0);

      expect(await r).to.eql([4, 5, 6]);
      expect(counter).to.equal(0);
    } catch (e) {
      await r;
      throw e;
    }

    return r;
  });

  it("Testing a Decision", async (): Promise<void> => {
    const trigger1 = new Decision();

    trigger1.resolve(1);
    trigger1.resolve(2);
    trigger1.resolve(3);

    const result1 = await trigger1;

    expect(result1).to.equal(1);

    const trigger2 = new Decision();

    trigger2.reject(new Error("Error 1"));
    trigger2.reject(new Error("Error 2"));
    trigger2.reject(new Error("Error 3"));

    try {
      await trigger2;
      throw new Error("Error 4");
    } catch (e) {
      expect(e.message).to.equal("Error 1");
    }
  });

  it("Deciding promises", async (): Promise<[void, void]> => {
    const trigger1 = new Decision();

    const p1 = trigger1.then((): number => 1);
    const p2 = trigger1.then((): number => 2);
    const p3 = trigger1.then((): number => 3);

    const p = Promise.all([p1, p2, p3]);
    let counter = 5;

    const r = repeatN(async (): Promise<number[]> => {
      counter--;
      return p;
    }, counter);

    try {
      expect(counter).to.equal(5);

      trigger1.resolve("resolved");
      expect(counter).to.equal(5);

      expect(await trigger1).to.equal("resolved");
      expect(counter).not.to.equal(0);

      expect(await p).to.eql([1, 2, 3]);
      expect(counter).not.to.equal(0);

      expect(await r).to.eql([1, 2, 3]);
      expect(counter).to.equal(0);
    } catch (e) {
      await r;
      throw e;
    }

    const trigger2 = new Decision();

    const p4 = trigger2.then((): number => 1, (): number => 4);
    const p5 = trigger2.then((): number => 2, (): number => 5);
    const p6 = trigger2.then((): number => 3, (): number => 6);

    const q = Promise.all([p4, p5, p6]);
    counter = 5;

    const s = repeatN(async (): Promise<number[]> => {
      counter--;
      return q;
    }, counter);

    try {
      expect(counter).to.equal(5);

      trigger2.reject(new Error("rejected"));
      expect(counter).to.equal(5);

      try {
        await trigger2;
      } catch (e) {
        expect(e.message).to.equal("rejected");
        expect(counter).not.to.equal(0);
      }

      expect(await q).to.eql([4, 5, 6]);
      expect(counter).not.to.equal(0);

      expect(await s).to.eql([4, 5, 6]);
      expect(counter).to.equal(0);
    } catch (e) {
      await s;
      throw e;
    }

    return Promise.all([r, s]);
  });
});
