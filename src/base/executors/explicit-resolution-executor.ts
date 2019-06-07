import { Executor } from "./executor";
import { ResolvableState } from "../states/resolution-state";

export function explicitResolutionExecutor<T>(
  state: ResolvableState<T>
): Executor<T> {
  return (resolve, reject): void => {
    state.register(resolve, reject);
  };
}
