import { expect } from "chai";
import {
  TimingOutTrigger,
  TimingOutDeadline,
  TimingOutDecision
} from "../../src/base/timeouts";
import { delay } from "../../src/helpers/delay";
import { repeatN } from "../../src/helpers/repeat";

describe("Testing Timeout classes", (): void => {
  it("Timing out a trigger", async (): Promise<void> => {
    const trigger = new TimingOutTrigger(5);

    const p1 = trigger.then((): number => 1);
    const p2 = trigger.then((): number => 2);
    const p3 = trigger.then((): number => 3);

    const p = Promise.all([p1, p2, p3]);
    let counter = 5;

    const r = repeatN(async (): Promise<number[]> => {
      counter--;
      return p;
    }, counter);

    delay(10).then((): void => {
      trigger.resolve("WRONG");
    });

    try {
      expect(counter).to.equal(5);

      const res = await trigger;

      expect(res).not.to.equal("WRONG");
      expect(res).to.be.undefined;
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

  it("Timing out a deadline", async (): Promise<void> => {
    const trigger = new TimingOutDeadline(5);

    const p1 = trigger.then((): number => 1, (): number => 4);
    const p2 = trigger.then((): number => 2, (): number => 5);
    const p3 = trigger.then((): number => 3, (): number => 6);

    const p = Promise.all([p1, p2, p3]);
    let counter = 5;

    const r = repeatN(async (): Promise<number[]> => {
      counter--;
      return p;
    }, counter);

    delay(10).then((): void => {
      trigger.reject(new Error("WRONG"));
    });

    try {
      expect(counter).to.equal(5);

      try {
        await trigger;
      } catch (e) {
        expect(e.message).not.to.equal("WRONG");
        expect(counter).not.to.equal(0);
      }

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

  it("Timing out a decision", async (): Promise<[void, void]> => {
    const trigger1 = new TimingOutDecision(5);

    const p1 = trigger1.then((): number => 1);
    const p2 = trigger1.then((): number => 2);
    const p3 = trigger1.then((): number => 3);

    const p = Promise.all([p1, p2, p3]);
    let counter = 5;

    const r = repeatN(async (): Promise<number[]> => {
      counter--;
      return p;
    }, counter);

    delay(10).then((): void => {
      trigger1.resolve("WRONG");
    });

    try {
      expect(counter).to.equal(5);

      const res = await trigger1;

      expect(res).not.to.equal("WRONG");
      expect(res).to.be.undefined;

      expect(counter).not.to.equal(0);

      expect(await p).to.eql([1, 2, 3]);
      expect(counter).not.to.equal(0);

      expect(await r).to.eql([1, 2, 3]);
      expect(counter).to.equal(0);
    } catch (e) {
      await r;
      throw e;
    }

    const trigger2 = new TimingOutDecision(5);

    const p4 = trigger2.then((): number => 1, (): number => 4);
    const p5 = trigger2.then((): number => 2, (): number => 5);
    const p6 = trigger2.then((): number => 3, (): number => 6);

    const q = Promise.all([p4, p5, p6]);
    counter = 5;

    const s = repeatN(async (): Promise<number[]> => {
      counter--;
      return q;
    }, counter);

    delay(10).then((): void => {
      trigger2.reject(new Error("WRONG"));
    });

    try {
      expect(counter).to.equal(5);

      try {
        await trigger2;
      } catch (e) {
        expect(e.message).not.to.equal("WRONG");
        expect(counter).not.to.equal(0);
      }

      expect(await q).to.eql([1, 2, 3]);
      expect(counter).not.to.equal(0);

      expect(await s).to.eql([1, 2, 3]);
      expect(counter).to.equal(0);
    } catch (e) {
      await s;
      throw e;
    }

    return Promise.all([r, s]);
  });
});
