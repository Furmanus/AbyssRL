import { ItemTypes } from '../../constants/itemTypes.constants';
import { EntityModel } from '../../../entity/models/entity.model';
import { WearableModel } from '../wearable.model';
import { ArmourNames } from '../../constants/armourNames.constants';

export interface SerializedArmour {
  id: string;
  itemType: ItemTypes.Armour;
  dodgeModifier: number;
  protectionModifier: number;
  name: ArmourNames;
  display: string;
}

export class ArmourModel extends WearableModel {
  public itemType: ItemTypes.Armour = ItemTypes.Armour;
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
    super(config);

    const { protectionModifier, dodgeModifier, name, display, id } = config;

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
      ...super.serialize(),
      protectionModifier: this.protectionModifier,
      dodgeModifier: this.dodgeModifier,
      name: this.name,
      display: this.display,
      itemType: this.itemType,
    };
  }
}
