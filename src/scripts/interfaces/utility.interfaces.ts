export type ExcludeFunctionProperties<T extends Record<string, any>> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends Function ? never : K;
  }[keyof T]
>;

export type ExchangePropertyType<T extends Record<string, unknown>, Property extends keyof T, TypeToReplace> = Omit<T, Property> & {
  [K in Property]: TypeToReplace;
};
