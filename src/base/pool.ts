import { Executor, explicitDecisionExecutor } from "./executors";
import { ResolvableState } from "./states";

import { AwaitSafeResolutionPromise } from "./triggers";

export class Pool<T> extends AwaitSafeResolutionPromise<T[]> {
  protected _nPendingValues: number;
  protected readonly _resolvedValues: T[];

  public constructor(executor?: Executor<T[]>) {
    super(executor || new ResolvableState(), explicitDecisionExecutor);

    this._nPendingValues = 0;
    this._resolvedValues = [];

    Object.defineProperty(this, "_nPendingValues", {
      writable: true,
      enumerable: false,
      configurable: false
    });

    Object.defineProperty(this, "_resolvedValues", {
      writable: false,
      enumerable: false,
      configurable: false
    });

    Object.seal(this);
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
              Object.freeze(this._resolvedValues);
              this._state.resolve(this._resolvedValues);
              Object.freeze(this);
            }
          }
        },
        (err: Error): void => {
          if (!this._state.done) {
            this._nPendingValues = 0;
            this._resolvedValues.length = 0;
            Object.freeze(this._resolvedValues);
            this._state.reject(err);
            Object.freeze(this);
          }
        }
      );
    }

    return this;
  }
}
