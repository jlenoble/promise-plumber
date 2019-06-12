import { TimingOutTrigger } from "../base/timeouts";

export function delay<T>(
  timeout: number,
  value?: T | PromiseLike<T>,
  after?: Promise<T>
): Promise<T> {
  const p: Promise<T> = new Promise((resolve): void => {
    setTimeout(resolve, timeout, typeof value !== "function" ? value : value());
  });

  return after ? after.then((): Promise<T> => p) : p;
}

export function delays<T>(
  timeouts: number[],
  values?: (T | PromiseLike<T> | undefined)[],
  after?: Promise<T>
): Promise<T>[] {
  if (timeouts.length === 0) {
    return [];
  }

  if (!values) {
    // Resolved values may be missing
    values = new Array(timeouts.length).fill(undefined);
  } else if (timeouts.length !== values.length) {
    return [];
  } else {
    // Guard against timeouts === values
    timeouts = timeouts.concat();
    values = values.concat();
  }

  const a: Promise<T>[] = [
    after || delay(timeouts.shift() as number, values.shift() as T)
  ];

  // We make sure all delays will resolve sequentially, even if their nominal
  // values are all over the place. It means that all delays will resolve
  // immediately once the largest one has resolved.
  timeouts.forEach((timeout: number, i: number): void => {
    a.push(
      delay(
        timeout,
        (values as (T | PromiseLike<T> | undefined)[])[i],
        a[i - 1]
      )
    );
  });

  return a;
}

export function collapsibleDelay<T>(
  timeout: number,
  value?: T | PromiseLike<T>,
  after?: TimingOutTrigger<T>
): TimingOutTrigger<T> {
  const p: TimingOutTrigger<T> = new TimingOutTrigger(timeout, value);

  return (after
    ? after.then((): TimingOutTrigger<T> => p)
    : p) as TimingOutTrigger<T>;
}

export function collapsibleDelays<T>(
  timeouts: number[],
  values?: (T | PromiseLike<T> | undefined)[],
  after?: TimingOutTrigger<T>
): TimingOutTrigger<T>[] {
  if (timeouts.length === 0) {
    return [];
  }

  if (!values) {
    // Resolved values may be missing
    values = new Array(timeouts.length).fill(undefined);
  } else if (timeouts.length !== values.length) {
    return [];
  } else {
    // Guard against timeouts === values
    timeouts = timeouts.concat();
    values = values.concat();
  }

  const a: TimingOutTrigger<T>[] = [
    after || collapsibleDelay(timeouts.shift() as number, values.shift() as T)
  ];

  // We make sure all delays will resolve sequentially, even if their nominal
  // values are all over the place. It means that all delays will resolve
  // immediately once the largest one has resolved. But of course they can be
  // collapsed explicitly first.
  timeouts.forEach((timeout: number, i: number): void => {
    a.push(
      collapsibleDelay(
        timeout,
        (values as (T | PromiseLike<T> | undefined)[])[i],
        a[i - 1]
      )
    );
  });

  return a;
}
