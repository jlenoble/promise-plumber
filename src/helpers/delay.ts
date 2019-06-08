export function delay<T>(
  timeout: number,
  value?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  after?: Promise<T>
): Promise<T> {
  return after
    ? after.then(
        (): Promise<T> =>
          new Promise((resolve): void => {
            setTimeout(
              resolve,
              timeout,
              typeof value !== "function" ? value : value()
            );
          })
      )
    : new Promise((resolve): void => {
        setTimeout(
          resolve,
          timeout,
          typeof value !== "function" ? value : value()
        );
      });
}

export function delays<T>(
  timeouts: number[],
  values?: (T | undefined)[],
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
    a.push(delay(timeout, (values as (T | undefined)[])[i], a[i - 1]));
  });

  return a;
}
