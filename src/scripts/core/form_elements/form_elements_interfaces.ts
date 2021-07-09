export type HTMLMultiSelectElement = Omit<HTMLSelectElement, 'value'> & {
  value: string[];
};
