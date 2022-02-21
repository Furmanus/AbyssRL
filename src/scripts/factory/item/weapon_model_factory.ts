import { weaponsData } from '../../model/items/weapons/data/weapons';
import {
  SerializedWeapon,
  WeaponModel,
} from '../../model/items/weapons/weapon_model';
import { WeaponNames } from '../../constants/items/weapons';
import { getRandomNumber } from '../../helper/rng';

export class WeaponModelFactory {
  public static getWeaponModel(type: SerializedWeapon): WeaponModel;
  public static getWeaponModel(type: WeaponNames): WeaponModel;
  public static getWeaponModel(
    type: WeaponNames | SerializedWeapon,
  ): WeaponModel {
    if (typeof type === 'string') {
      return new WeaponModel(weaponsData[type]);
    }

    return new WeaponModel(type);
  }

  public static getRandomWeaponModel(): WeaponModel {
    const weaponsDataKeys: string[] = Object.keys(weaponsData);
    const { length } = weaponsDataKeys;
    const randomKey: string = weaponsDataKeys[getRandomNumber(0, length - 1)];
    const weaponConstructorConfig = weaponsData[randomKey];

    return new WeaponModel(weaponConstructorConfig);
  }
}
