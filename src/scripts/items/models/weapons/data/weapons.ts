import { DamageTypes } from '../../../../combat/combat.constants';
import { WeaponCriticalDamageType } from '../../../constants/weapons.constants';
import { SerializedWeapon } from '../weapon.model';
import { ItemTypes } from '../../../constants/itemTypes.constants';

export interface IWeaponData {
  [type: string]: SerializedWeapon;
}

const defaultWeaponOptions: { id: string; itemType: ItemTypes.Weapon } = {
  id: null,
  itemType: ItemTypes.Weapon,
};

export const weaponsData: IWeaponData = {
  long_sword: {
    ...defaultWeaponOptions,
    damage: '1d8',
    toHit: '1d3',
    name: 'long sword',
    type: DamageTypes.Slashing,
    criticalDamageType: [WeaponCriticalDamageType.Bleeding],
  },
  broad_axe: {
    ...defaultWeaponOptions,
    damage: '1d6+3',
    toHit: '1d2',
    name: 'broad axe',
    type: DamageTypes.Slashing,
    criticalDamageType: [WeaponCriticalDamageType.Bleeding],
  },
  short_spear: {
    ...defaultWeaponOptions,
    damage: '1d6',
    toHit: '1d4',
    name: 'short spear',
    type: DamageTypes.Piercing,
    criticalDamageType: [WeaponCriticalDamageType.Bleeding],
  },
  morning_star: {
    ...defaultWeaponOptions,
    damage: '1d7+2',
    toHit: '1d1',
    name: 'morning star',
    type: DamageTypes.Bludgeoning,
    criticalDamageType: [WeaponCriticalDamageType.Stun],
  },
};
