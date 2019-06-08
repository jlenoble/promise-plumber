// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function immediate<T>(value?: T): Promise<T> {
  return Promise.resolve(typeof value !== "function" ? value : value());
}
