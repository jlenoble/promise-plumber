import { Executor } from "./executor";
import { ResolutionState } from "../states";
import { waitForDone } from "../../helpers/wait";

export function genericResolutionExecutor<T>(
  executor: Executor<T>,
  state: ResolutionState<T>
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
  state: ResolutionState<T>
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
  state: ResolutionState<T>
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
