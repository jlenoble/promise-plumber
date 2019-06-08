import { Executor } from "./executors/executor";
import { RunState, RunningState } from "./states/run-state";
import { DecidePromise, Decision } from "./triggers";

interface ResolutionWindow<T> extends DecidePromise<T> {
  start: () => void;
  pause: () => void;
  resume: () => void;
}

export abstract class AbstractResolutionWindow<T> extends Decision<T>
  implements ResolutionWindow<T> {
  protected readonly _state: RunState<T>;

  public constructor(executor?: Executor<T>) {
    const state: RunState<T> = new RunningState();
    super(executor || state);
    this._state = state;
  }

  public start(): void {
    this._state.start();
  }

  public pause(): void {
    this._state.pause();
  }

  public resume(): void {
    this._state.resume();
  }
}

export class ValidationWindow<T> extends AbstractResolutionWindow<T[]> {
  protected readonly _resolvedValues: T[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(start: Executor<T[]> | Promise<any>, end: Promise<any>) {
    if (typeof start === "function") {
      super(start);
    } else {
      super();

      start.then(this.start.bind(this), this.reject.bind(this));

      Promise.all([start, end]).then(
        this.resolve.bind(this),
        this.reject.bind(this)
      );
    }

    this._resolvedValues = [];
  }

  public add(value: T | PromiseLike<T>): this {
    Promise.resolve(value).then((val: T): void => {
      if (this._state.running) {
        this._resolvedValues.push(val);
      }
    }, this.reject.bind(this));

    return this;
  }

  public resolve(): void {
    if (!this._state.done) {
      this._state.resolve(this._resolvedValues);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    if (!this._state.done) {
      this._resolvedValues.length = 0;
      this._state.reject(reason);
    }
  }
}
