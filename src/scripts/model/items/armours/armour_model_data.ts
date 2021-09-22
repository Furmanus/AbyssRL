import { ArmourNames } from '../../../constants/items/armour_names';
import { ItemSprites } from '../../../constants/cells/sprites';

export interface IArmourConfig {
  dodgeModifier: number;
  protectionModifier: number;
  name: ArmourNames;
  display: string;
}

export const armourData: Record<ArmourNames, IArmourConfig> = {
  [ArmourNames.Robe]: {
    dodgeModifier: 0,
    protectionModifier: 1,
    name: ArmourNames.Robe,
    display: ItemSprites.Armour,
  },
  [ArmourNames.LeatherArmour]: {
    dodgeModifier: 0,
    protectionModifier: 2,
    name: ArmourNames.LeatherArmour,
    display: ItemSprites.Armour,
  },
  [ArmourNames.ScaleMail]: {
    dodgeModifier: -1,
    protectionModifier: 3,
    name: ArmourNames.ScaleMail,
    display: ItemSprites.Armour,
  },
  [ArmourNames.ChainMail]: {
    dodgeModifier: -2,
    protectionModifier: 4,
    name: ArmourNames.ChainMail,
    display: ItemSprites.Armour,
  },
  [ArmourNames.PlateMail]: {
    dodgeModifier: -4,
    protectionModifier: 5,
    name: ArmourNames.PlateMail,
    display: ItemSprites.Armour,
  },
};
