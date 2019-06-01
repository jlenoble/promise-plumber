import { Executor, Resolve, Reject } from "./executor";

export class Delayed<T, U> extends Promise<T> {
  public constructor(executor: Executor<T>, promise: Promise<U>) {
    const lateExecutor: Executor<T> = (resolve, reject): void => {
      const lateResolve: Resolve<T> = (value): void => {
        promise.then((): void => resolve(value));
      };

      const lateReject: Reject = (err): void => {
        promise.then((): void => reject(err));
      };

      executor(lateResolve, lateReject);
    };

    super(lateExecutor);
  }
}

export default function delayed<U>(promise: Promise<U>): PromiseConstructor {
  return class DelayedPromise<T> extends Delayed<T, U> {
    public constructor(executor: Executor<T>) {
      super(executor, promise);
    }
  };
}
