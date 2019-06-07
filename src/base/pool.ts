import { Executor } from "./executors/executor";
import { explicitResolutionExecutor } from "./executors/explicit-resolution-executor";
import { ResolvableState } from "./states/resolution-state";
import { AwaitSafeResolutionPromise } from "./triggers";

export class Pool<T> extends AwaitSafeResolutionPromise<T[]> {
  protected _nPendingValues: number = 0;
  protected readonly _resolvedValues: T[] = [];

  public constructor(executor?: Executor<T[]>) {
    super(executor || new ResolvableState(), explicitResolutionExecutor);
  }

  public add(value: T | PromiseLike<T>): this {
    if (!this._state.done) {
      this._nPendingValues++;

      Promise.resolve(value).then(
        (val: T): void => {
          if (!this._state.done) {
            this._resolvedValues.push(val);
            this._nPendingValues--;

            if (this._nPendingValues === 0) {
              this._state.resolve(this._resolvedValues);
            }
          }
        },
        (err: Error): void => {
          if (!this._state.done) {
            this._nPendingValues = 0;
            this._resolvedValues.length = 0;
            this._state.reject(err);
          }
        }
      );
    }

    return this;
  }
}
