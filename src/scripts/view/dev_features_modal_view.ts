import { DevDungeonModalEvents } from '../constants/events/devDungeonModalEvents';
import { ModalView } from './modal_view';

export type DevFeaturesModalViewElements = {
  dungeonWidthInput: HTMLInputElement;
  dungeonHeightInput: HTMLInputElement;
  devForm: HTMLFormElement;
  levelTypeSelect: HTMLSelectElement;
};

export type DevFormValues = {
  devDungeonWidth: string;
  devDungeonHeight: string;
  devDungeonLevelType: string;
} & Record<string, string>;

export class DevFeaturesModalView extends ModalView<DevFeaturesModalViewElements> {
  protected onWindowKeydownCallback = (e: KeyboardEvent): void => {};

  public attachEvents(): void {
    super.attachEvents();

    const { devForm } = this.template.elements;

    devForm.addEventListener('submit', this.onDevFormSubmit);
  }

  public detachEvents() {
    super.detachEvents();

    const { devForm } = this.template.elements;

    devForm.removeEventListener('submit', this.onDevFormSubmit);
  }

  public setDungeonWidth(width: string): void {
    const { dungeonWidthInput } = this.template.elements;

    if (dungeonWidthInput) {
      dungeonWidthInput.value = width;
    }
  }

  public setDungeonHeight(height: string): void {
    const { dungeonHeightInput } = this.template.elements;

    if (dungeonHeightInput) {
      dungeonHeightInput.value = height;
    }
  }

  private onDevFormSubmit = (e: Event): void => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const parsedFormData = Array.from(formData.keys()).reduce(
      (result: DevFormValues, current) => {
        result[current] = formData.get(current) as string;

        return result;
      },
      {} as DevFormValues,
    );

    this.notify(DevDungeonModalEvents.FormSubmitInView, parsedFormData);
  };
}
