import { Resolve, Reject } from "./executor";

export interface ResolutionState<T> {
  done: boolean;
  value?: T | PromiseLike<T>;
  reason?: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  resolve: Resolve<T>;
  reject: Reject;
}

export class ResolvedState<T> implements ResolutionState<T> {
  public readonly done: true;
  public readonly value?: T | PromiseLike<T>;

  public constructor(value?: T | PromiseLike<T>) {
    this.done = true;
    this.value = value;
    Object.freeze(this);
  }

  public resolve(): void {}
  public reject(): void {}
}

export class RejectedState<T> implements ResolutionState<T> {
  public readonly done: true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly reason?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(reason?: any) {
    this.done = true;
    this.reason = reason;
    Object.freeze(this);
  }

  public resolve(): void {}
  public reject(): void {}
}

export class ResolvableState<T> implements ResolutionState<T> {
  public done: boolean;
  public value?: T | PromiseLike<T>;
  public reason?: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  public constructor() {
    this.done = false;
    this.value = undefined;
    this.reason = undefined;
    Object.seal(this);
  }

  public resolve(value?: T | PromiseLike<T>): void {
    if (!this.done) {
      this.done = true;
      this.value = value;
      Object.freeze(this);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    if (!this.done) {
      this.done = true;
      this.reason = reason;
      Object.freeze(this);
    }
  }
}
