import { DevDungeonModalEvents } from '../constants/events/devDungeonModalEvents';
import { ModalView } from './modal_view';
import { Monsters } from '../constants/monsters';

export type DevFeaturesModalViewElements = {
  dungeonWidthInput: HTMLInputElement;
  dungeonHeightInput: HTMLInputElement;
  dungeonRoomTypesSelect: HTMLSelectElement;
  devForm: HTMLFormElement;
  levelTypeSelect: HTMLSelectElement;
  noMonstersCheckbox: HTMLInputElement;
  monsterSpawnSelect: HTMLSelectElement;
};

export type DevFormValues = {
  devDungeonWidth: string;
  devDungeonHeight: string;
  devDungeonLevelType: string;
  dungeonRoomTypes: string[];
  noMonsters: boolean;
} & Record<string, string>;

export class DevFeaturesModalView extends ModalView<DevFeaturesModalViewElements> {
  protected onWindowKeydownCallback = (e: KeyboardEvent): void => {};

  public constructor(...args: any[]) {
    super(...args);

    this.buildLists();
  }

  public buildLists(): void {
    this.buildSpawnMonsterList();
  }

  public attachEvents(): void {
    super.attachEvents();

    const { devForm, monsterSpawnSelect } = this.template.elements;

    devForm.addEventListener('submit', this.onDevFormSubmit);
    monsterSpawnSelect.addEventListener(
      'change',
      this.onMonsterSpawnSelectChange,
    );
  }

  public detachEvents() {
    super.detachEvents();

    const { devForm, monsterSpawnSelect } = this.template.elements;

    devForm.removeEventListener('submit', this.onDevFormSubmit);
    monsterSpawnSelect.removeEventListener(
      'change',
      this.onMonsterSpawnSelectChange,
    );
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

  public resetMonsterSpawnSelect(): void {
    const { monsterSpawnSelect } = this.template.elements;

    monsterSpawnSelect.value = '';
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

  private buildSpawnMonsterList(): void {
    const { monsterSpawnSelect } = this.template.elements;
    const temporaryFragment = document.createDocumentFragment();

    for (const [type, description] of Object.entries(Monsters)) {
      temporaryFragment.appendChild(new Option(type, description));
    }

    monsterSpawnSelect.appendChild(temporaryFragment);
  }

  private onMonsterSpawnSelectChange = (e: Event): void => {
    const { value } = e.target as HTMLSelectElement;

    if (value) {
      this.notify(DevDungeonModalEvents.SpawnMonster, value);
    }
  };
}
