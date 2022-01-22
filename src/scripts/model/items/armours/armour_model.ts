import { ItemTypes } from '../../../constants/items/item';
import { EntityModel } from '../../entity/entity_model';
import { WearableModel } from '../wearable_model';
import { ArmourNames } from '../../../constants/items/armour_names';

export interface SerializedArmour {
  dodgeModifier: number;
  protectionModifier: number;
  name: ArmourNames;
  display: string;
}

export class ArmourModel extends WearableModel {
  public itemType = ItemTypes.Armour;
  public display: string;
  public dodgeModifier: number;
  public protectionModifier: number;
  public name: ArmourNames;

  public get description(): string {
    return this.name;
  }

  public get fullDescription(): string {
    return `${this.name} [${this.dodgeModifier}, ${this.protectionModifier}]`;
  }

  public constructor(config: SerializedArmour) {
    super();

    const { protectionModifier, dodgeModifier, name, display } = config;

    this.display = display;
    this.name = name;
    this.protectionModifier = protectionModifier;
    this.dodgeModifier = dodgeModifier;
  }

  public wear(entity: EntityModel) {
    entity.equipArmour(this);
  }

  public takeoff(entity: EntityModel) {
    entity.unequipArmour();
  }

  /**
   * Returns serialized model data.
   * @returns  Serialized natural weapon model data
   */
  public getDataToSerialization(): SerializedArmour {
    return {
      protectionModifier: this.protectionModifier,
      dodgeModifier: this.dodgeModifier,
      name: this.name,
      display: this.display,
    };
  }
}
