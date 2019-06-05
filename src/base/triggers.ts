import { Executor } from "./executor";
import {
  ResolvableState,
  resolutionExecutor,
  rejectionExecutor,
  decisionExecutor
} from "./trigger-executors";

export class Trigger<T> extends Promise<T> {
  private _state: ResolvableState<T>;

  public constructor(executor?: Executor<T>) {
    // Trigger is instanciated without any argument normally but in async
    // functions, awaiting an instance will call this ctor again. We have to
    // guard against starting implicitly infinite loops, which we do by checking
    // on the existence of executor.
    if (executor) {
      super(executor);
      this._state = { done: true };
    } else {
      const state: ResolvableState<T> = { done: false };
      super(resolutionExecutor(state));
      this._state = state;
    }
  }

  public resolve(value?: T | PromiseLike<T>): void {
    if (!this._state.done) {
      this._state.value = value;
      this._state.done = true;
    }
  }
}

export class Canceller<T> extends Promise<T> {
  private _state: ResolvableState<T>;

  public constructor(executor?: Executor<T>) {
    // Canceller is instanciated without any argument normally but in async
    // functions, awaiting an instance will call this ctor again. We have to
    // guard against starting implicitly infinite loops, which we do by checking
    // on the existence of executor.
    if (executor) {
      super(executor);
      this._state = { done: true };
    } else {
      const state: ResolvableState<T> = { done: false };
      super(rejectionExecutor(state));
      this._state = state;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    if (!this._state.done) {
      this._state.reason = reason;
      this._state.done = true;
    }
  }
}

export class DecisionMaker<T> extends Promise<T> {
  private _state: ResolvableState<T>;

  public constructor(executor?: Executor<T>) {
    // DecisionMaker is instanciated without any argument normally but in async
    // functions, awaiting an instance will call this ctor again. We have to
    // guard against starting implicitly infinite loops, which we do by checking
    // on the existence of executor.
    if (executor) {
      super(executor);
      this._state = { done: true };
    } else {
      const state: ResolvableState<T> = { done: false };
      super(decisionExecutor(state));
      this._state = state;
    }
  }

  public resolve(value?: T | PromiseLike<T>): void {
    if (!this._state.done) {
      this._state.value = value;
      this._state.done = true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    if (!this._state.done) {
      this._state.reason = reason;
      this._state.done = true;
    }
  }
}