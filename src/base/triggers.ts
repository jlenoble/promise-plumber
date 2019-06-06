import {
  Executor,
  explicitResolutionExecutor,
  explicitRejectionExecutor,
  explicitDecisionExecutor
} from "./executors/index";

import {
  ResolutionState,
  ResolvedState,
  ResolvableState
} from "./states/resolution-states";

export class AwaitSafeResolutionPromise<T> extends Promise<T> {
  protected readonly _state: ResolutionState<T>;

  public constructor(
    executorOrOptions: Executor<T> | ResolutionState<T>,
    factory: (arg: ResolutionState<T>) => Executor<T>
  ) {
    // In async functions, awaiting a derived Promise instance will call
    // implicitly its ctor again. We have to guard against this behaviour for
    // Trigger promises because they start infinite loops that can only be
    // broken from explicitly, so we check on the nature of executorOrOptions.
    // If its type is a function, it means that this ctor was called implicitly.
    if (typeof executorOrOptions === "function") {
      super(executorOrOptions);
      this._state = new ResolvedState();
    } else {
      super(factory(executorOrOptions));
      this._state = executorOrOptions;
    }

    Object.defineProperty(this, "_state", {
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export class Trigger<T> extends AwaitSafeResolutionPromise<T> {
  public constructor(executor?: Executor<T>) {
    super(executor || new ResolvableState(), explicitResolutionExecutor);
    Object.freeze(this);
  }

  public resolve(value?: T | PromiseLike<T>): void {
    this._state.resolve(value);
  }
}

export class Canceller<T> extends AwaitSafeResolutionPromise<T> {
  public constructor(executor?: Executor<T>) {
    super(executor || new ResolvableState(), explicitRejectionExecutor);
    Object.freeze(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    this._state.reject(reason);
  }
}

export class DecisionMaker<T> extends AwaitSafeResolutionPromise<T> {
  public constructor(executor?: Executor<T>) {
    super(executor || new ResolvableState(), explicitDecisionExecutor);
    Object.freeze(this);
  }

  public resolve(value?: T | PromiseLike<T>): void {
    this._state.resolve(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    this._state.reject(reason);
  }
}
