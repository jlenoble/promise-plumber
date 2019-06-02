const delay = (n: number): Promise<void> => {
  return new Promise(
    (resolve): void => {
      setTimeout(resolve, n);
    }
  );
};

export default delay;
