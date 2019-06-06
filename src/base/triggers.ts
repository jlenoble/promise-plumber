import { Executor } from "./executor";
import {
  resolutionExecutor,
  rejectionExecutor,
  decisionExecutor
} from "./trigger-executors";
import {
  ResolutionState,
  ResolvedState,
  ResolvableState
} from "./resolution-state";

export class Trigger<T> extends Promise<T> {
  private readonly _state: ResolutionState<T>;

  public constructor(executor?: Executor<T>) {
    // Trigger is instanciated without any argument normally but in async
    // functions, awaiting an instance will call this ctor again. We have to
    // guard against starting implicitly infinite loops, which we do by checking
    // on the existence of executor.
    if (executor) {
      super(executor);
      this._state = new ResolvedState();
    } else {
      const state: ResolutionState<T> = new ResolvableState();
      super(resolutionExecutor(state));
      this._state = state;
    }

    Object.defineProperty(this, "_state", {
      writable: false,
      enumerable: false,
      configurable: false
    });

    Object.freeze(this);
  }

  public resolve(value?: T | PromiseLike<T>): void {
    this._state.resolve(value);
  }
}

export class Canceller<T> extends Promise<T> {
  private readonly _state: ResolutionState<T>;

  public constructor(executor?: Executor<T>) {
    // Canceller is instanciated without any argument normally but in async
    // functions, awaiting an instance will call this ctor again. We have to
    // guard against starting implicitly infinite loops, which we do by checking
    // on the existence of executor.
    if (executor) {
      super(executor);
      this._state = new ResolvedState();
    } else {
      const state: ResolutionState<T> = new ResolvableState();
      super(rejectionExecutor(state));
      this._state = state;
    }

    Object.defineProperty(this, "_state", {
      writable: false,
      enumerable: false,
      configurable: false
    });

    Object.freeze(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    this._state.reject(reason);
  }
}

export class DecisionMaker<T> extends Promise<T> {
  private readonly _state: ResolutionState<T>;

  public constructor(executor?: Executor<T>) {
    // DecisionMaker is instanciated without any argument normally but in async
    // functions, awaiting an instance will call this ctor again. We have to
    // guard against starting implicitly infinite loops, which we do by checking
    // on the existence of executor.
    if (executor) {
      super(executor);
      this._state = new ResolvedState();
    } else {
      const state: ResolutionState<T> = new ResolvableState();
      super(decisionExecutor(state));
      this._state = state;
    }

    Object.defineProperty(this, "_state", {
      writable: false,
      enumerable: false,
      configurable: false
    });

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
