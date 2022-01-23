import { ArmourNames } from '../../../constants/items/armour_names';
import { ItemSprites } from '../../../constants/cells/sprites';
import { SerializedArmour } from './armour_model';
import { ItemTypes } from '../../../constants/items/item';

const defaultArmourOptions: {
  itemType: ItemTypes.Armour;
  display: ItemSprites.Armour;
} = {
  itemType: ItemTypes.Armour,
  display: ItemSprites.Armour,
};

export const armourData: Record<ArmourNames, SerializedArmour> = {
  [ArmourNames.Robe]: {
    ...defaultArmourOptions,
    dodgeModifier: 0,
    protectionModifier: 1,
    name: ArmourNames.Robe,
  },
  [ArmourNames.LeatherArmour]: {
    ...defaultArmourOptions,
    dodgeModifier: 0,
    protectionModifier: 2,
    name: ArmourNames.LeatherArmour,
  },
  [ArmourNames.ScaleMail]: {
    ...defaultArmourOptions,
    dodgeModifier: -1,
    protectionModifier: 3,
    name: ArmourNames.ScaleMail,
  },
  [ArmourNames.ChainMail]: {
    ...defaultArmourOptions,
    dodgeModifier: -2,
    protectionModifier: 4,
    name: ArmourNames.ChainMail,
  },
  [ArmourNames.PlateMail]: {
    ...defaultArmourOptions,
    dodgeModifier: -4,
    protectionModifier: 5,
    name: ArmourNames.PlateMail,
  },
};
