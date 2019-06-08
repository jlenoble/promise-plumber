export default function delay<T>(
  timeout: number,
  value?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  after?: Promise<T>
): Promise<T> {
  return after
    ? after.then(
        (): Promise<T> =>
          new Promise(
            (resolve): void => {
              setTimeout(
                resolve,
                timeout,
                typeof value !== "function" ? value : value()
              );
            }
          )
      )
    : new Promise(
        (resolve): void => {
          setTimeout(
            resolve,
            timeout,
            typeof value !== "function" ? value : value()
          );
        }
      );
}

export function delays<T>(
  timeouts: number[],
  values: T[],
  after?: Promise<T>
): Promise<T>[] {
  if (
    timeouts.length === 0 ||
    values.length === 0 ||
    timeouts.length !== values.length
  ) {
    return [];
  }

  timeouts = timeouts.concat();
  values = values.concat();

  const a: Promise<T>[] = [
    after || delay(timeouts.shift() as number, values.shift() as T)
  ];

  timeouts.forEach(
    (timeout: number, i: number): void => {
      a.push(delay(timeout, values[i], a[i - 1]));
    }
  );

  return a;
}
