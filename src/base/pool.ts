import { Executor, explicitResolutionExecutor } from "./executors";
import { ResolvableState } from "./states";

import { AwaitSafeResolutionPromise } from "./triggers";

export class Pool<T> extends AwaitSafeResolutionPromise<T[]> {
  protected readonly _elements: Set<T | PromiseLike<T>>;
  protected readonly _resolvedElements: T[];

  public constructor(executor?: Executor<T[]>) {
    super(executor || new ResolvableState(), explicitResolutionExecutor);
    this._elements = new Set();
    this._resolvedElements = [];

    Object.defineProperty(this, "_elements", {
      writable: false,
      enumerable: false,
      configurable: false
    });

    Object.defineProperty(this, "_resolvedElements", {
      writable: false,
      enumerable: false,
      configurable: false
    });

    Object.freeze(this);
  }

  public add(element: T | PromiseLike<T>): boolean {
    if (this._elements.has(element) || this._state.done) {
      return false;
    }

    this._elements.add(element);

    Promise.resolve(element)
      .then(
        (el: T): void => {
          this._resolvedElements.push(el);
        },
        (): void => {}
      )
      .finally(
        (): void => {
          this._elements.delete(element);

          if (this._elements.size === 0) {
            this._state.resolve(this._resolvedElements);
          }
        }
      );

    return true;
  }
}
