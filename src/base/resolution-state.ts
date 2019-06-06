export interface ResolutionState<T> {
  done: boolean;
  value?: T | PromiseLike<T>;
  reason?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
