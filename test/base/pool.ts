import { expect } from "chai";
import { Pool } from "../../src/base/pool";
import delay from "../helpers/delay";

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
