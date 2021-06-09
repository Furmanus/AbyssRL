import { weaponsData } from '../../model/items/weapons/data/weapons';
import { WeaponModel } from '../../model/items/weapons/weapon_model';
import { WeaponNames } from '../../constants/weapons';
import { IWeaponConstructorConfig } from '../../interfaces/combat';
import { getRandomNumber } from '../../helper/rng';

export const weaponModelFactory = {
  getWeaponModel(type: WeaponNames): WeaponModel {
    if (type in weaponsData) {
      return new WeaponModel(weaponsData[type]);
    }
  },
  getRandomWeaponModel(): WeaponModel {
    const weaponsDataKeys: string[] = Object.keys(weaponsData);
    const { length } = weaponsDataKeys;
    const randomKey: string = weaponsDataKeys[getRandomNumber(0, length - 1)];
    const weaponConstructorConfig: IWeaponConstructorConfig = weaponsData[randomKey];

    return new WeaponModel((weaponConstructorConfig));
  },
};
