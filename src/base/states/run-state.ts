import { ResolutionState, ResolvableState } from "./resolution-state";

export interface RunState<T> extends ResolutionState<T> {
  started: boolean;
  running: boolean;

  start: () => void;
  pause: () => void;
  resume: () => void;
}

export class RunningState<T> extends ResolvableState<T> implements RunState<T> {
  public started: boolean = false;
  public running: boolean = false;

  public start(): void {
    if (!this.started) {
      this.started = true;
      this.running = true;
    }
  }

  public pause(): void {
    this.running = false;
  }

  public resume(): void {
    if (this.started && !this.done) {
      this.running = true;
    }
  }

  public resolve(value?: T | PromiseLike<T>): void {
    if (this.running) {
      super.resolve(value);
      this.running = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reject(reason?: any): void {
    if (this.running) {
      super.reject(reason);
      this.running = false;
    }
  }
}
