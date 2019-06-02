import { Executor, Resolve } from "./executor";

export function gateExecutor<T, U>(
  executor: Executor<T>,
  promise: Promise<U>
): Executor<T> {
  // executor is executed immediately, but its results are passed through only
  // after promise has resolved. In case promise is rejected, then the results
  // are dropped.
  // A side-effect may be used to collect or reduce the results in a container
  // or a variable. The latter will therefore be up-to-date when used down the
  // line.
  // You may also call then/catch on your promises: They will be gated too.
  return (resolve, reject): void => {
    const lateResolve: Resolve<T> = (value): void => {
      promise.then((): void => resolve(value), (e): void => reject(e));
    };

    executor(lateResolve, reject);
  };
}

export default function gate<U>(promise: Promise<U>): PromiseConstructor {
  return class GatePromise<T> extends Promise<T> {
    public constructor(executor: Executor<T>) {
      super(gateExecutor(executor, promise));
    }
  };
}
