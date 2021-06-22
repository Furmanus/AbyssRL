export type TemplateObject = {
  content: string;
} & Record<string, string>;

export type PreparedViewTemplate<Elements extends Record<string, HTMLElement>> =
  {
    content: DocumentFragment;
    elements: Elements;
  };
