import { MultiSelect } from './multiselect/multiselect';
import { SingleSelect } from './singleselect/single_select';

export function buildFormElements(form: HTMLFormElement): void {
  const formChildren = form.querySelectorAll('*');

  for (const child of formChildren) {
    if (child instanceof HTMLSelectElement) {
      if (child.hasAttribute('multiple')) {
        MultiSelect.getInstance(child).build();
      } else {
        SingleSelect.getInstance(child).build();
      }
    }
  }
}
