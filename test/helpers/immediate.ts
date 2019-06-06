// eslint-disable-next-line @typescript-eslint/no-explicit-any
const immediate = (value?: any): Promise<void> => {
  return Promise.resolve(typeof value !== "function" ? value : value());
};

export default immediate;
