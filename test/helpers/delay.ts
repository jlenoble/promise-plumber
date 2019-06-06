// eslint-disable-next-line @typescript-eslint/no-explicit-any
const delay = (timeout: number, value?: any): Promise<void> => {
  return new Promise(
    (resolve): void => {
      setTimeout(
        resolve,
        timeout,
        typeof value !== "function" ? value : value()
      );
    }
  );
};

export default delay;
