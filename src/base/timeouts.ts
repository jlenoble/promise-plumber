import {
  Trigger,
  Deadline,
  Decision,
  ResolvePromise,
  RejectPromise,
  DecidePromise
} from "./triggers";
import { Executor } from "./executors/executor";
import { TimeoutState } from "./states/timeout-state";

export class TimingOutTrigger<T> extends Trigger<T>
  implements ResolvePromise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(timeout: number | Executor<T>, value: any) {
    if (typeof timeout === "function") {
      super(timeout);
    } else {
      super(new TimeoutState(timeout, value));
    }
  }
}

export class TimingOutDeadline<T> extends Deadline<T>
  implements RejectPromise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(timeout: number | Executor<T>, value: any) {
    if (typeof timeout === "function") {
      super(timeout);
    } else {
      super(new TimeoutState(timeout, value));
    }
  }
}

export class TimingOutDecision<T> extends Decision<T>
  implements DecidePromise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(timeout: number | Executor<T>, value: any) {
    if (typeof timeout === "function") {
      super(timeout);
    } else {
      super(new TimeoutState(timeout, value));
    }
  }
}
