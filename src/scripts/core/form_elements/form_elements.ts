import { MultiSelect } from './multiselect';

export function buildFormElements(form: HTMLFormElement): void {
  const formChildren = form.querySelectorAll('*');

  for (const child of formChildren) {
    if (child instanceof HTMLSelectElement) {
      if (child.hasAttribute('multiple')) {
        MultiSelect.getInstance(child).build();
      }
    }
  }
}
