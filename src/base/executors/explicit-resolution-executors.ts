import { Executor } from "./executor";
import { ResolutionState } from "../states";
import { waitForDone } from "../../helpers/wait";

export function explicitResolutionExecutor<T>(
  state: ResolutionState<T>
): Executor<T> {
  return (resolve): void => {
    waitForDone(state).then((): void => resolve(state.value));
  };
}

export function explicitRejectionExecutor<T>(
  state: ResolutionState<T>
): Executor<T> {
  return (resolve, reject): void => {
    waitForDone(state).then((): void => reject(state.reason));
  };
}

export function explicitDecisionExecutor<T>(
  state: ResolutionState<T>
): Executor<T> {
  return (resolve, reject): void => {
    waitForDone(state).then(
      (): void => {
        if (state.reason) reject(state.reason);
        else resolve(state.value);
      }
    );
  };
}
