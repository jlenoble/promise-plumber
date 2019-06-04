import { expect } from "chai";
import delay from "../helpers/delay";
import { repeatUntil } from "../helpers/repeat";
import immediate from "../helpers/immediate";
import LooseObject from "../helpers/loose-object";

export const triggerableTest = (): ReturnType<typeof it> =>
  it("Triggering a Promise", async (): Promise<void> => {
    const started = { started: true };
    const notStarted = { notStarted: true };

    const trigger: LooseObject = new Promise(
      (resolve): void => {
        immediate().then(
          (): void => {
            Object.defineProperty(trigger, "start", {
              value: (v: object): void => resolve(v)
            });
          }
        );
      }
    );

    let result: object = notStarted;

    trigger.then(
      (): void => {
        result = started;
      }
    );

    expect(result).to.equal(notStarted);

    await immediate();

    expect(result).to.equal(notStarted);

    trigger.start();

    expect(result).to.equal(notStarted);

    await immediate();

    expect(result).to.equal(started);
  });

export const cancelableTest = (): ReturnType<typeof it> =>
  it("Canceling a queued/non pending Promise", async (): Promise<void> => {
    const started = { started: true };
    const notStarted = { notStarted: true };
    const canceled = { canceled: true };

    const trigger: LooseObject = new Promise(
      (resolve, reject): void => {
        immediate().then(
          (): void => {
            Object.defineProperty(trigger, "cancel", {
              value: (e: Error): void => reject(e)
            });
          }
        );
      }
    );

    let result: object = notStarted;

    trigger.then(
      (): void => {
        result = started;
      },
      (): void => {
        result = canceled;
      }
    );

    expect(result).to.equal(notStarted);

    await immediate();

    expect(result).to.equal(notStarted);

    trigger.cancel();

    expect(result).to.equal(notStarted);

    await immediate();

    expect(result).to.equal(canceled);
  });

export const interruptibleTest = (): ReturnType<typeof it> =>
  it("Canceling a pending Promise", async (): Promise<void> => {
    const started = { started: true };
    const notStarted = { notStarted: true };
    const canceled = { canceled: true };
    const completed = { completed: true };

    const trigger1: LooseObject = new Promise(
      (resolve): void => {
        immediate().then(
          (): void => {
            Object.defineProperty(trigger1, "start", {
              value: (v: object): void => resolve(v)
            });
          }
        );
      }
    );

    const trigger2: LooseObject = new Promise(
      (resolve, reject): void => {
        immediate().then(
          (): void => {
            Object.defineProperty(trigger2, "cancel", {
              value: (e: Error): void => reject(e)
            });
          }
        );
      }
    );

    let result: object = notStarted;

    const interruptible = new Promise(
      (resolve): void => {
        const t1 = Date.now();
        let t2 = t1;

        const rslv = (): LooseObject => {
          if (t2 - t1 < 10) {
            t2 = Date.now();
            return result;
          }

          return completed;
        };

        resolve(
          repeatUntil(
            rslv,
            (returnValue: LooseObject): boolean =>
              returnValue === canceled || returnValue === completed
          )
        );
      }
    );

    trigger1
      .then(
        (): Promise<void | LooseObject> => {
          result = started;
          return Promise.race([interruptible, trigger2]);
        }
      )
      .then(
        (): void => {
          result = completed;
        },
        (): void => {
          result = canceled;
        }
      );

    expect(result).to.equal(notStarted);

    await immediate();

    expect(result).to.equal(notStarted);

    trigger1.start();

    expect(result).to.equal(notStarted);

    await immediate();

    expect(result).to.equal(started);

    return delay(0).then(
      async (): Promise<void> => {
        trigger2.cancel();
        expect(result).to.equal(started);
        await immediate();
        expect(result).to.equal(canceled);
      }
    );
  });
