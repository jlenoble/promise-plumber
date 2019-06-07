import { Executor, Resolve, Reject } from "../executors/executor";

export interface ResolutionState<T> {
  done: boolean;
  value?: T | PromiseLike<T>;
  reason?: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  register: Executor<T>;
  resolve: Resolve<T>;
  reject: Reject;
}

export class ResolvedState<T> implements ResolutionState<T> {
  public done: boolean = true;

  public register(): void {}
  public resolve(): void {}
  public reject(): void {}
}

export class ResolvableState<T> implements ResolutionState<T> {
  public done: boolean = false;
  public value?: T | PromiseLike<T>;
  public reason?: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  private _resolve?: Resolve<T>;
  private _reject?: Reject;

  public register(resolve: Resolve<T>, reject?: Reject): void {
    if (!this._resolve) {
      this._resolve = resolve;
      this._reject = reject;
    }
  }

  public resolve(value?: T | PromiseLike<T>): void {
    if (this._resolve && !this.done) {
      this.done = true;
      this.value = value;
      this._resolve(value);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    if (this._reject && !this.done) {
      this.done = true;
      this.reason = reason;
      this._reject(reason);
    }
  }
}
