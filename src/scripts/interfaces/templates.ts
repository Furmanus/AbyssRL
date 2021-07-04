export type TemplateObject = {
  content: string;
} & Record<string, string>;

export type PreparedViewTemplate<Elements extends Record<string, HTMLElement>> =
  {
    content: HTMLDivElement;
    elements: Elements;
    insert: (
      targetElement: HTMLElement | DocumentFragment,
      referenceNode?: HTMLElement,
    ) => void;
  };
