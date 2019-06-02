import { expect } from "chai";
import gate from "../src/base/gate";

const testSuite = (Promise: PromiseConstructor): void => {
  describe(`Testing Promise interface of ${Promise.name}`, (): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const args: any[] = [null, 1, false, undefined, {}, [], "foo"];

    args.forEach(
      (t): void => {
        it(`Resolving primary type ${JSON.stringify(t)}`, async (): Promise<
          void
        > => {
          const p = new Promise(
            (resolve): void => {
              resolve(t);
            }
          );

          let r = await p;

          expect(r).to.eql(t);
          expect(r).to.equal(t);

          r = await Promise.resolve(t);

          expect(r).to.eql(t);
          expect(r).to.equal(t);
        });
      }
    );

    it("Resolving a resolving promise", async (): Promise<void> => {
      const o = {};
      const p0 = Promise.resolve(o);
      const p = new Promise(
        (resolve): void => {
          resolve(p0);
        }
      );

      const r = await p;

      expect(r).to.eql(o);
      expect(r).to.equal(o);
    });

    it("Catching an exception", async (): Promise<void> => {
      const e = new Error("foo");
      const p0 = Promise.reject(e);
      let hasThrown = false;

      try {
        await p0;
      } catch (err) {
        hasThrown = true;
        expect(err).to.eql(e);
        expect(err).to.equal(e);
      }

      expect(hasThrown).to.be.true;

      hasThrown = false;

      const p = new Promise(
        (resolve, reject): void => {
          resolve; // Hack to get rid of "value never read" ts warning
          reject(e);
        }
      );

      try {
        await p;
      } catch (err) {
        hasThrown = true;
        expect(err).to.eql(e);
        expect(err).to.equal(e);
      }

      expect(hasThrown).to.be.true;
    });
  });
};

const delay = (n: number): Promise<void> => {
  return new Promise(
    (resolve): void => {
      setTimeout(resolve, n);
    }
  );
};

testSuite(Promise);
testSuite(gate(delay(100)));
