export const waitUntil = (
  stopFn: () => boolean,
  every: number = 0
): Promise<void> => {
  return new Promise((resolve, reject): void => {
    const intervalId = setInterval((): void => {
      try {
        if (stopFn()) {
          clearInterval(intervalId);
          resolve();
        }
      } catch (e) {
        clearInterval(intervalId);
        reject(e);
      }
    }, every);
  });
};

export const waitForDone = (
  state: { done: boolean },
  every: number = 0
): Promise<void> => {
  return new Promise((resolve): void => {
    const intervalId = setInterval((): void => {
      if (state.done) {
        clearInterval(intervalId);
        resolve();
      }
    }, every);
  });
};

export const waitFor = (timeout: number): Promise<void> => {
  return new Promise((resolve): void => {
    setTimeout((): void => {
      resolve();
    }, timeout);
  });
};

export const waitN = (n: number, every: number = 0): Promise<void> => {
  if (n < 1) {
    n = 1;
  }

  return new Promise((resolve): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const intervalId = setInterval((): void => {
      n--;

      if (n <= 0) {
        clearInterval(intervalId);
        resolve();
      }
    }, every);
  });
};
