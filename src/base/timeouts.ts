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
  public constructor(timeout: number | Executor<T>) {
    if (typeof timeout === "function") {
      super(timeout);
    } else {
      super(new TimeoutState(timeout));
    }
  }
}

export class TimingOutDeadline<T> extends Deadline<T>
  implements RejectPromise<T> {
  public constructor(timeout: number | Executor<T>) {
    if (typeof timeout === "function") {
      super(timeout);
    } else {
      super(new TimeoutState(timeout));
    }
  }
}

export class TimingOutDecision<T> extends Decision<T>
  implements DecidePromise<T> {
  public constructor(timeout: number | Executor<T>) {
    if (typeof timeout === "function") {
      super(timeout);
    } else {
      super(new TimeoutState(timeout));
    }
  }
}
