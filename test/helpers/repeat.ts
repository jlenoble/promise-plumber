export const repeatUntil = (
  fn: Function,
  stop: Function,
  every: number = 0
): Promise<void> => {
  return new Promise(
    (resolve, reject): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let lastValue: any;

      const intervalId = setInterval((): void => {
        try {
          const returnValue = fn();

          if (stop(returnValue)) {
            clearInterval(intervalId);
            resolve(lastValue);
          } else {
            lastValue = returnValue;
          }
        } catch (e) {
          clearInterval(intervalId);
          reject(e);
        }
      }, every);
    }
  );
};

export const repeatFor = (
  fn: Function,
  timeout: number,
  every: number = 0
): Promise<void> => {
  return new Promise(
    (resolve, reject): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let lastValue: any;

      const intervalId = setInterval((): void => {
        try {
          lastValue = fn();
        } catch (e) {
          clearInterval(intervalId);
          reject(e);
        }
      }, every);

      setTimeout((): void => {
        clearInterval(intervalId);
        resolve(lastValue);
      }, timeout);
    }
  );
};

export const repeatN = (
  fn: Function,
  n: number,
  every: number = 0
): Promise<void> => {
  if (n < 1) {
    n = 1;
  }

  return new Promise(
    (resolve, reject): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let lastValue: any;

      const intervalId = setInterval((): void => {
        try {
          lastValue = fn();
          n--;

          if (n <= 0) {
            clearInterval(intervalId);
            resolve(lastValue);
          }
        } catch (e) {
          clearInterval(intervalId);
          reject(e);
        }
      }, every);
    }
  );
};
