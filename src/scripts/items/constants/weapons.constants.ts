import { EntityStatusFactory } from '../../entity/factory/entityStatus.factory';

export enum WeaponNames {
  LongSword = 'long_sword',
  BroadAxe = 'broad_axe',
  ShortSpear = 'short_spear',
  MorningStar = 'morning_star',
}

export enum NaturalWeaponNames {
  Teeth = 'teeth',
  Fist = 'fist',
}

export enum WeaponCriticalDamageType {
  Bleeding = 'bleeding',
  Stun = 'stunned',
}

export const criticalDamageTypeToStatusConstructor = {
  [WeaponCriticalDamageType.Bleeding]:
    EntityStatusFactory.getEntityBleedingStatus,
  [WeaponCriticalDamageType.Stun]: EntityStatusFactory.getEntityStunnedStatus,
};
