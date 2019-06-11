import { expect } from "chai";
import { Sink, Pool } from "../../src/base/pools";
import { delay } from "../../src/helpers/delay";

describe("Testing Pool classes", (): void => {
  it("Testing a Pool of values", async (): Promise<void> => {
    const pool = new Pool();

    pool.add(1);
    pool.add(2);
    pool.add(3);

    delay(0).then((): void => pool.resolve());

    const results = await pool;

    expect(results).to.eql([1, 2, 3]);
  });

  it("Testing a Pool of Promises", async (): Promise<void> => {
    const pool = new Pool();

    pool.add(delay(5, 100));
    pool.add(delay(10, 200));
    pool.add(delay(0, 300));

    await delay(10);

    pool.add(delay(0, 400));
    pool.add(delay(0, 500));

    delay(0).then((): void => pool.resolve());

    const results = await pool;

    expect(results).to.eql([300, 100, 200, 400, 500]);
  });

  it("Testing a Pool of Promises with errors", async (): Promise<void> => {
    const pool = new Pool();

    const err = Promise.reject(new Error("PoolingError"));
    err.catch((): void => {});

    pool.add(delay(5, err));
    pool.add(delay(10, 200));
    pool.add(delay(0, 300));

    pool.catch((): void => {});

    await delay(10);

    pool.add(delay(0, 400));
    pool.add(delay(0, 500));

    delay(0).then((): void => pool.resolve());

    try {
      await pool;
      throw new Error("MissedError");
    } catch (e) {
      expect(e.message).to.equal("PoolingError");
    }
  });

  it("Testing a Sink of values", async (): Promise<void> => {
    const sink = new Sink();

    sink.add(1);
    sink.add(2);
    sink.add(3);

    const results = await sink;

    expect(results).to.eql([1, 2, 3]);
  });

  it("Testing a Sink of Promises", async (): Promise<void> => {
    const sink = new Sink();

    sink.add(delay(5, 100));
    sink.add(delay(10, 200));
    sink.add(delay(0, 300));

    await delay(10);

    sink.add(delay(0, 400));
    sink.add(delay(0, 500));

    const results = await sink;

    expect(results).to.eql([300, 100, 200]);
  });

  it("Testing a Sink of Promises with errors", async (): Promise<void> => {
    const sink = new Sink();

    const err = Promise.reject(new Error("PoolingError"));
    err.catch((): void => {});

    sink.add(delay(5, err));
    sink.add(delay(10, 200));
    sink.add(delay(0, 300));

    sink.catch((): void => {});

    await delay(10);

    sink.add(delay(0, 400));
    sink.add(delay(0, 500));

    try {
      await sink;
      throw new Error("MissedError");
    } catch (e) {
      expect(e.message).to.equal("PoolingError");
    }
  });
});
