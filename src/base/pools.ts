import { Decision } from "./triggers";

export class Pool<T> extends Decision<T[]> {
  protected _nPendingValues: number = 0;
  protected readonly _resolvedValues: T[] = [];

  public add(value: T | PromiseLike<T>): this {
    if (!this._state.done) {
      this._nPendingValues++;

      Promise.resolve(value).then((val: T): void => {
        if (!this._state.done) {
          this._resolvedValues.push(val);
          this._nPendingValues--;
        }
      }, this.reject.bind(this));
    }

    return this;
  }

  public resolve(): void {
    this._state.resolve(this._resolvedValues);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    if (!this._state.done) {
      this._nPendingValues = 0;
      this._resolvedValues.length = 0;
      super.reject(reason);
    }
  }
}

export class Sink<T> extends Pool<T> {
  public add(value: T | PromiseLike<T>): this {
    if (!this._state.done) {
      this._nPendingValues++;

      Promise.resolve(value).then((val: T): void => {
        if (!this._state.done) {
          this._resolvedValues.push(val);
          this._nPendingValues--;

          if (this._nPendingValues === 0) {
            this.resolve();
          }
        }
      }, this.reject.bind(this));
    }

    return this;
  }
}
