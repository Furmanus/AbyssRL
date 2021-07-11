import { DamageTypes } from '../../../../constants/combat_enums';

export interface IWeaponConfigObject {
  damage: string;
  toHit: string;
  name: string;
  type: DamageTypes;
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
  },
  broad_axe: {
    damage: '1d6+3',
    toHit: '1d2',
    name: 'broad axe',
    type: DamageTypes.Slashing,
  },
  short_spear: {
    damage: '1d6',
    toHit: '1d4',
    name: 'short spear',
    type: DamageTypes.Piercing,
  },
  morning_star: {
    damage: '1d7+2',
    toHit: '1d1',
    name: 'morning star',
    type: DamageTypes.Bludgeoning,
  },
};
