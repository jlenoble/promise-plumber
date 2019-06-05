import { Executor } from "./executor";
import { waitForDone } from "../helpers/wait";

export interface ResolvableState<T> {
  done: boolean;
  value?: T | PromiseLike<T>;
  reason?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function genericResolutionExecutor<T>(
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

export function genericRejectionExecutor<T>(
  executor: Executor<T>,
  state: ResolvableState<T>
): Executor<T> {
  return (resolve, reject): void => {
    const _reject = (): void => {
      waitForDone(state).then((): void => reject(state.reason));
    };

    executor(resolve, _reject);
  };
}

export function genericDecisionExecutor<T>(
  executor: Executor<T>,
  state: ResolvableState<T>
): Executor<T> {
  return (resolve, reject): void => {
    const _resolve = (): void => {
      waitForDone(state).then(
        (): void => {
          if (state.reason) reject(state.reason);
          else resolve(state.value);
        }
      );
    };

    executor(_resolve, _resolve);
  };
}

export function resolutionExecutor<T>(state: ResolvableState<T>): Executor<T> {
  return (resolve): void => {
    waitForDone(state).then((): void => resolve(state.value));
  };
}

export function rejectionExecutor<T>(state: ResolvableState<T>): Executor<T> {
  return (resolve, reject): void => {
    waitForDone(state).then((): void => reject(state.reason));
  };
}

export function decisionExecutor<T>(state: ResolvableState<T>): Executor<T> {
  return (resolve, reject): void => {
    waitForDone(state).then(
      (): void => {
        if (state.reason) reject(state.reason);
        else resolve(state.value);
      }
    );
  };
}
