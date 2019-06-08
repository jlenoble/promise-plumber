import { expect } from "chai";
import { ValidationWindow } from "../../src/base/windows";
import delay, { delays } from "../helpers/delay";

export const valueValidationWindowTest = (): ReturnType<typeof it> =>
  it("Testing a ValidationWindow for values", async (): Promise<void> => {
    const start = delay(0);
    const end = delay(5);
    const window = new ValidationWindow(start, end);

    window.add(1);
    window.add(2);
    window.add(3);

    await start;

    window.add(4);
    window.add(5);
    window.add(6);

    await end;

    window.add(7);
    window.add(8);
    window.add(9);

    const results = await window;

    expect(results).to.eql([4, 5, 6]);
  });

export const promiseValidationWindowTest = (): ReturnType<typeof it> =>
  it("Testing a ValidationWindow for promises", async (): Promise<void> => {
    const start = delay(5);
    const end = delay(10);
    const window = new ValidationWindow(start, end);

    window.add(delay(1, 1));
    window.add(delay(7, 2));
    window.add(delay(12, 3));

    window.add(delay(1, 4));
    window.add(delay(7, 5));
    window.add(delay(12, 6));

    window.add(delay(1, 7));
    window.add(delay(7, 8));
    window.add(delay(12, 9));

    const results = await window;

    expect(results).to.eql([2, 5, 8]);

    await delay(3);
  });

export const promiseValidationWindowErrorTest = (): ReturnType<typeof it> =>
  it("Testing a ValidationWindow for promises with errors", async (): Promise<
    void
  > => {
    let start = delay(5);
    let end = delay(10);
    let window = new ValidationWindow(start, end);

    const err = Promise.reject(new Error("ValidationError"));
    err.catch((): void => {});

    window.add(delay(1, 1));
    window.add(delay(7, err));
    window.add(delay(12, 3));

    try {
      await window;
      throw new Error("MissedError");
    } catch (e) {
      expect(e.message).to.equal("ValidationError");
    }

    await delay(6);

    start = delay(5);
    end = delay(10);
    window = new ValidationWindow(start, end);

    window.add(delay(1, err));
    window.add(delay(7, 5));
    window.add(delay(12, 6));

    try {
      await window;
      throw new Error("MissedError");
    } catch (e) {
      expect(e.message).to.equal("MissedError");
      expect(await window).to.eql([5]);
    }

    await delay(6);

    start = delay(5);
    end = delay(10);
    window = new ValidationWindow(start, end);

    window.add(delay(1, 7));
    window.add(delay(7, 8));
    window.add(delay(12, err));

    try {
      await window;
      throw new Error("MissedError");
    } catch (e) {
      expect(e.message).to.equal("MissedError");
      expect(await window).to.eql([8]);
    }

    await delay(6);
  });

export const resumeValidationWindowTest = (): ReturnType<typeof it> =>
  it("Pausing and resuming a ValidationWindow", async (): Promise<void> => {
    const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const d = delays(a, a);

    const start = d[4];
    const end = d[12];

    const window = new ValidationWindow(start, end);

    window
      .add(d[0])
      .add(d[1])
      .add(d[2])
      .add(d[3])
      .add(d[5])
      .add(d[7])
      .add(d[8])
      .add(d[10])
      .add(d[11])
      .add(d[13])
      .add(d[14])
      .add(d[15]);

    d[6].then(
      (): void => {
        window.pause();
      }
    );

    d[9].then(
      (): void => {
        window.resume();
      }
    );

    const results = await window;

    expect(results).to.eql([5, 10, 11]);

    await delay(3);
  });
