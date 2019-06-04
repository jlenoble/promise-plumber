// eslint-disable-next-line @typescript-eslint/no-explicit-any
const delay = (n: number, value?: any): Promise<void> => {
  return new Promise(
    (resolve): void => {
      setTimeout(resolve, n, value);
    }
  );
};

export default delay;
