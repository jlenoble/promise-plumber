import { Executor } from "./executor";
import { repeatUntil } from "../helpers/repeat";

export interface ResolvableState<T> {
  done: boolean;
  value?: T | PromiseLike<T>;
}

export function resolvingExecutor<T>(
  executor: Executor<T>,
  state: ResolvableState<T>
): Executor<T> {
  return (resolve, reject): void => {
    const _resolve = (): void => {
      repeatUntil((): void => {}, (): boolean => state.done).then(
        (): void => resolve(state.value)
      );
    };

    executor(_resolve, reject);
  };
}

export function rejectingExecutor<T>(
  executor: Executor<T>,
  state: ResolvableState<T>
): Executor<T> {
  return (resolve, reject): void => {
    const _reject = (): void => {
      repeatUntil((): void => {}, (): boolean => state.done).then(
        (): void => reject(state.value)
      );
    };

    executor(resolve, _reject);
  };
}
