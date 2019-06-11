import { Resolve, Reject } from "../executors/executor";
import { ResolvableState } from "./resolution-state";

export class TimeoutState<T> extends ResolvableState<T> {
  protected _timeoutId?: NodeJS.Timeout;
  protected readonly _timeout: number;

  public constructor(timeout: number) {
    super();

    this._timeout = timeout;

    this._timeoutId = setTimeout((): void => {
      this._timeoutId = undefined;
      this.resolve();
    }, timeout);
  }

  public register(resolve: Resolve<T>, reject: Reject): void {
    const _resolve = (value?: T | PromiseLike<T>): void => {
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
      }
      resolve(value);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _reject = (reason?: any): void => {
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
      }
      reject(reason);
    };

    super.register(_resolve, _reject);
  }
}
