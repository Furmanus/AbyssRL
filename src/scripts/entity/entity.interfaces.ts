import { WeaponModel } from '../items/models/weapons/weapon.model';
import { ArmourModel } from '../items/models/armours/armour_model';

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
