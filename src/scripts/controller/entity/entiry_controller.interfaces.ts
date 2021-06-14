import { WeaponModel } from '../../model/items/weapons/weapon_model';

export type EntityWeaponChangeReasons = 'equip';

export type EntityWeaponChangeData = {
  currentWeapon: WeaponModel;
  previousWeapon: WeaponModel;
  reason: EntityWeaponChangeReasons;
};
