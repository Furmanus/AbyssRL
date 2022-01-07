export type ExcludeFunctionProperties<T extends Record<string, any>> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T]
>;
