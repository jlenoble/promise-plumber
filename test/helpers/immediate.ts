// eslint-disable-next-line @typescript-eslint/no-explicit-any
const immediate = (value?: any): Promise<void> => {
  return new Promise(
    (resolve): void => {
      setImmediate(resolve, value);
    }
  );
};

export default immediate;
