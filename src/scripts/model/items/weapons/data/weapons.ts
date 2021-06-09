export interface IWeaponConfigObject {
  damage: string;
  toHit: string;
  name: string;
  type: string;
}
export interface IWeaponData {
  [type: string]: IWeaponConfigObject;
}

export const weaponsData: IWeaponData = {
  long_sword: {
    damage: '1d8',
    toHit: '1d3',
    name: 'long sword',
    type: 'slashing',
  },
  broad_axe: {
    damage: '1d6+3',
    toHit: '1d2',
    name: 'broad axe',
    type: 'slashing',
  },
  short_spear: {
    damage: '1d6',
    toHit: '1d4',
    name: 'short spear',
    type: 'piercing',
  },
  morning_star: {
    damage: '1d7+2',
    toHit: '1d1',
    name: 'morning star',
    type: 'bludgeoning',
  },
};
