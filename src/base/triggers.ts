import { Executor, Resolve, Reject } from "./executors/executor";
import { explicitResolutionExecutor } from "./executors/explicit-resolution-executor";

import {
  ResolutionState,
  ResolvedState,
  ResolvableState
} from "./states/resolution-state";

export interface AbstractResolutionPromise<T> extends Promise<T> {
  resolve?: Resolve<T>;
  reject?: Reject;
}

export interface ResolvePromise<T> extends Promise<T> {
  resolve: Resolve<T>;
}

export interface RejectPromise<T> extends Promise<T> {
  reject: Reject;
}

export interface DecidePromise<T> extends Promise<T> {
  resolve: Resolve<T>;
  reject: Reject;
}

export type ResolutionPromise<T> =
  | ResolvePromise<T>
  | RejectPromise<T>
  | (ResolvePromise<T> & RejectPromise<T>);

export abstract class AwaitSafeResolutionPromise<T> extends Promise<T>
  implements AbstractResolutionPromise<T> {
  protected readonly _state: ResolutionState<T>;

  public constructor(
    executorOrState: Executor<T> | ResolutionState<T>,
    factory: (state: ResolutionState<T>) => Executor<T>
  ) {
    // In async functions, awaiting a derived Promise instance will call
    // implicitly its ctor again. We have to guard against this behaviour for
    // Triggers because they can only be resolved explicitly, so we check on the
    // nature of executorOrState. If its type is a function, it means that this
    // ctor was called implicitly.
    if (typeof executorOrState === "function") {
      super(executorOrState);
      this._state = new ResolvedState();
    } else {
      super(factory(executorOrState));
      this._state = executorOrState;
    }
  }
}

export class Trigger<T> extends AwaitSafeResolutionPromise<T>
  implements ResolvePromise<T> {
  public constructor(executor?: Executor<T> | ResolutionState<T>) {
    super(executor || new ResolvableState(), explicitResolutionExecutor);
  }

  public resolve(value?: T | PromiseLike<T>): void {
    this._state.resolve(value);
  }
}

export class Deadline<T> extends AwaitSafeResolutionPromise<T>
  implements RejectPromise<T> {
  public constructor(executor?: Executor<T> | ResolutionState<T>) {
    super(executor || new ResolvableState(), explicitResolutionExecutor);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    this._state.reject(reason);
  }
}

export class Decision<T> extends AwaitSafeResolutionPromise<T>
  implements DecidePromise<T> {
  public constructor(executor?: Executor<T> | ResolutionState<T>) {
    super(executor || new ResolvableState(), explicitResolutionExecutor);
  }

  public resolve(value?: T | PromiseLike<T>): void {
    this._state.resolve(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    this._state.reject(reason);
  }
}
