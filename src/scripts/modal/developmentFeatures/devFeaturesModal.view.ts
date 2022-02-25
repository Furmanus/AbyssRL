import { DevFeaturesModalConstants } from './devFeaturesModal.constants';
import { ModalView } from '../modal.view';
import { Monsters } from '../../entity/constants/monsters';
import { buildFormElements } from '../../core/form_elements/form_elements';
import { getDataFromSessionStorage } from '../../utils/storage_helper';
import { SessionStorageKeys } from '../../constants/storage';
import { HTMLMultiSelectElement } from '../../core/form_elements/form_elements_interfaces';

export type DevFeaturesModalViewElements = {
  dungeonWidthInput: HTMLInputElement;
  dungeonHeightInput: HTMLInputElement;
  dungeonRoomTypesSelect: HTMLMultiSelectElement;
  devForm: HTMLFormElement;
  levelTypeSelect: HTMLSelectElement;
  noMonstersCheckbox: HTMLInputElement;
  monsterSpawnSelect: HTMLSelectElement;
  healPlayerButton: HTMLButtonElement;
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

  protected initialize(): void {
    this.buildLists();

    buildFormElements(this.template.elements.devForm);

    this.setDataFromStorage();
  }

  public buildLists(): void {
    this.buildSpawnMonsterList();
  }

  public attachEvents(): void {
    super.attachEvents();

    const { devForm, monsterSpawnSelect, healPlayerButton } =
      this.template.elements;

    devForm.addEventListener('submit', this.onDevFormSubmit);
    monsterSpawnSelect.addEventListener(
      'change',
      this.onMonsterSpawnSelectChange,
    );
    healPlayerButton.addEventListener('click', this.onHealButtonClick);
  }

  public detachEvents() {
    super.detachEvents();

    const { devForm, monsterSpawnSelect, healPlayerButton } =
      this.template.elements;

    devForm.removeEventListener('submit', this.onDevFormSubmit);
    monsterSpawnSelect.removeEventListener(
      'change',
      this.onMonsterSpawnSelectChange,
    );
    healPlayerButton.removeEventListener('click', this.onHealButtonClick);
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

    this.notify(DevFeaturesModalConstants.FormSubmitInView, parsedFormData);
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
      this.notify(DevFeaturesModalConstants.SpawnMonster, value);
    }
  };

  private onHealButtonClick = (): void => {
    this.notify(DevFeaturesModalConstants.HealPlayer);
  };

  private setDataFromStorage(): void {
    const data = getDataFromSessionStorage<DevFormValues>(
      SessionStorageKeys.DevFeatures,
    );

    if (data) {
      const {
        devDungeonHeight,
        devDungeonWidth,
        devDungeonLevelType,
        dungeonRoomTypes,
        noMonsters,
      } = data;
      const {
        dungeonWidthInput,
        dungeonHeightInput,
        levelTypeSelect,
        dungeonRoomTypesSelect,
        noMonstersCheckbox,
      } = this.template.elements;

      if (devDungeonWidth) {
        dungeonWidthInput.value = devDungeonWidth;
      }

      if (devDungeonHeight) {
        dungeonHeightInput.value = devDungeonHeight;
      }

      if (devDungeonLevelType) {
        levelTypeSelect.value = devDungeonLevelType;
      }

      if (dungeonRoomTypes) {
        dungeonRoomTypesSelect.value = dungeonRoomTypes;
      }

      if (noMonsters) {
        noMonstersCheckbox.checked = noMonsters;
      }
    }
  }
}
