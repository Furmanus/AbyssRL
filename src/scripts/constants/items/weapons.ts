import { EntityStatusFactory } from '../../factory/entity/entity_status_factory';

export enum WeaponNames {
  LongSword = 'long_sword',
  BroadAxe = 'broad_axe',
  ShortSpear = 'short_spear',
  MorningStar = 'morning_star',
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
