import { Executor } from "./executor";
import { waitForDone } from "../helpers/wait";

export interface ResolvableState<T> {
  done: boolean;
  value?: T | PromiseLike<T>;
}

export function resolutionExecutor<T>(
  executor: Executor<T>,
  state: ResolvableState<T>
): Executor<T> {
  return (resolve, reject): void => {
    const _resolve = (): void => {
      waitForDone(state).then((): void => resolve(state.value));
    };

    executor(_resolve, reject);
  };
}

export function rejectionExecutor<T>(
  executor: Executor<T>,
  state: ResolvableState<T>
): Executor<T> {
  return (resolve, reject): void => {
    const _reject = (): void => {
      waitForDone(state).then((): void => reject(state.value));
    };

    executor(resolve, _reject);
  };
}
