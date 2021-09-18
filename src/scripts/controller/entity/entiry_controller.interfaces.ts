import { WeaponModel } from '../../model/items/weapons/weapon_model';
import { ArmourModel } from '../../model/items/armours/armour_model';

export type EntityWeaponChangeReasons = 'equip';

export type EntityWeaponChangeData = {
  currentWeapon: WeaponModel;
  previousWeapon: WeaponModel;
  reason: EntityWeaponChangeReasons;
};

type EntityArmourEquipData = {
  reason: 'equip';
  currentArmour: ArmourModel;
};

type EntityArmourRemoveData = {
  reason: 'remove';
  previousArmour: ArmourModel;
};

export type EntityArmourChangeData =
  | EntityArmourRemoveData
  | EntityArmourEquipData;
