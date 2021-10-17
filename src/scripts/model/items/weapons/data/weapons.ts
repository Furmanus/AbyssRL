import { DamageTypes } from '../../../../constants/combat_enums';
import { WeaponCriticalDamageType } from '../../../../constants/items/weapons';

export interface IWeaponConfigObject {
  damage: string;
  toHit: string;
  name: string;
  type: DamageTypes;
  criticalDamageType: WeaponCriticalDamageType[];
}
export interface IWeaponData {
  [type: string]: IWeaponConfigObject;
}

export const weaponsData: IWeaponData = {
  long_sword: {
    damage: '1d8',
    toHit: '1d3',
    name: 'long sword',
    type: DamageTypes.Slashing,
    criticalDamageType: [WeaponCriticalDamageType.Bleeding],
  },
  broad_axe: {
    damage: '1d6+3',
    toHit: '1d2',
    name: 'broad axe',
    type: DamageTypes.Slashing,
    criticalDamageType: [WeaponCriticalDamageType.Bleeding],
  },
  short_spear: {
    damage: '1d6',
    toHit: '1d4',
    name: 'short spear',
    type: DamageTypes.Piercing,
    criticalDamageType: [WeaponCriticalDamageType.Bleeding],
  },
  morning_star: {
    damage: '1d7+2',
    toHit: '1d1',
    name: 'morning star',
    type: DamageTypes.Bludgeoning,
    criticalDamageType: [WeaponCriticalDamageType.Stun],
  },
};
