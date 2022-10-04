import { weaponsData } from '../../models/weapons/data/weapons';
import {
  SerializedWeapon,
  WeaponModel,
} from '../../models/weapons/weapon.model';
import { WeaponNames } from '../../constants/weapons.constants';
import { rngService } from '../../../utils/rng.service';

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
    const randomKey: string = weaponsDataKeys[rngService.getRandomNumber(0, length - 1)];
    const weaponConstructorConfig = weaponsData[randomKey];

    return new WeaponModel(weaponConstructorConfig);
  }
}
