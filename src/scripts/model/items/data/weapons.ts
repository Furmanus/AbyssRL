export interface IWeaponConfigObject {
  damage: string;
  toHit: string;
  name: string;
  type: 'slashing' | 'piercing' | 'bludgeoning';
}
export interface IWeaponData {
  [type: string]: IWeaponConfigObject;
}

export const weaponsData: IWeaponData = {
  short_sword: {
    damage: `1d6`,
    toHit: `1d4`,
    name: `short sword`,
    type: 'slashing',
  },
  long_sword: {
    damage: `1d8`,
    toHit: `1d3`,
    name: `long_sword`,
    type: `slashing`,
  },
  silver_sword: {
    damage: `1d7-1`,
    toHit: `1d3`,
    name: `silver sword`,
    type: 'slashing',
  },
  axe: {
    damage: `1d6+3`,
    toHit: `1d2`,
    name: `axe`,
    type: `slashing`,
  },
  spear: {
    damage: `1d6`,
    toHit: `1d3`,
    name: `spear`,
    type: `piercing`,
  },
  mace: {
    damage: `1d6+1`,
    toHit: `1d3`,
    name: `mace`,
    type: 'bludgeoning',
  },
  morning_star: {
    damage: `1d7+2`,
    toHit: `1d2`,
    name: `morning star`,
    type: `bludgeoning`,
  },
  dagger: {
    damage: `1d4`,
    toHit: `1d4`,
    name: `dagger`,
    type: `piercing`,
  },
  halberd: {
    damage: `2d7+1`,
    toHit: `1d1`,
    name: `halberd`,
    type: `slashing`,
  },
  club: {
    damage: `1d6`,
    toHit: `1d1`,
    name: `club`,
    type: `bludgeoning`,
  },
  two_handed_hammer: {
    damage: `2d6+2`,
    toHit: `1d1`,
    name: `two handed hammer`,
    type: 'bludgeoning',
  },
  two_handed_sword: {
    damage: `2d6+1`,
    toHit: `1d1`,
    name: `two handed sword`,
    type: 'slashing',
  },
  two_handed_axe: {
    damage: `2d6+4`,
    toHit: `1d1`,
    name: `two handed axe`,
    type: 'slashing',
  },
};
