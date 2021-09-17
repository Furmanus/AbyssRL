import { ItemTypes } from '../../../constants/items/item';
import { WearableModel } from '../wearable_model';
import { IArmourConfig } from './armour_model_data';

export class ArmourModel extends WearableModel {
  public display: string;
  public itemType = ItemTypes.Armour;
  public dodgeModifier: number;
  public protectionModifier: number;
  public name: string;

  public get description(): string {
    return this.name;
  }

  public get fullDescription(): string {
    return `${this.name} [${this.dodgeModifier}, ${this.protectionModifier}]`;
  }

  public constructor(config: IArmourConfig) {
    super();

    const { protectionModifier, dodgeModifier, name, display } = config;

    this.display = display;
    this.name = name;
    this.protectionModifier = protectionModifier;
    this.dodgeModifier = dodgeModifier;
  }

  /**
   * Returns serialized model data.
   * @returns  Serialized natural weapon model data
   */
  public getDataToSerialization(): string {
    return JSON.stringify({
      protectionModifier: this.protectionModifier,
      dodgeModifier: this.dodgeModifier,
      name: this.name,
      display: this.display,
    });
  }
}
