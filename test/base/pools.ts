import { expect } from "chai";
import { Sink as Pool } from "../../src/base/pools";
import { delay } from "../../src/helpers/delay";

export const valuePoolTest = (): ReturnType<typeof it> =>
  it("Testing a Pool of values", async (): Promise<void> => {
    const pool = new Pool();

    pool.add(1);
    pool.add(2);
    pool.add(3);

    const results = await pool;

    expect(results).to.eql([1, 2, 3]);
  });

export const promisePoolTest = (): ReturnType<typeof it> =>
  it("Testing a Pool of Promises", async (): Promise<void> => {
    const pool = new Pool();

    pool.add(delay(5, 100));
    pool.add(delay(10, 200));
    pool.add(delay(0, 300));

    await delay(10);

    pool.add(delay(0, 400));
    pool.add(delay(0, 500));

    const results = await pool;

    expect(results).to.eql([300, 100, 200]);
  });

export const promisePoolErrorTest = (): ReturnType<typeof it> =>
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

    try {
      await pool;
      throw new Error("MissedError");
    } catch (e) {
      expect(e.message).to.equal("PoolingError");
    }
  });
