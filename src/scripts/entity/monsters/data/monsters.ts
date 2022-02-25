import { IEntity } from '../../entity_interfaces';
import { MonsterSizes, MonstersTypes } from '../../constants/monsters';
import { entities } from '../../../dungeon/constants/sprites.constants';
import { ItemsCollection } from '../../../items/items_collection';
import { NaturalWeaponFactory } from '../../../items/factory/naturalWeapon.factory';

export type MonsterStats = Pick<
  IEntity,
  | 'strength'
  | 'dexterity'
  | 'intelligence'
  | 'toughness'
  | 'speed'
  | 'perception'
  | 'description'
  | 'type'
  | 'display'
  | 'protection'
  | 'hitPoints'
  | 'maxHitPoints'
  | 'size'
  | 'inventory'
  | 'naturalWeapon'
>;

interface IMonsterDataObject {
  [key: string]: MonsterStats;
}

export const monstersData: IMonsterDataObject = {
  [MonstersTypes.GiantRat]: {
    strength: 2,
    dexterity: 10,
    intelligence: 5,
    toughness: 2,
    speed: 110,
    perception: 6,
    description: 'giant rat',
    type: MonstersTypes.GiantRat,
    display: entities.GIANT_RAT,
    protection: 0,
    hitPoints: 10,
    maxHitPoints: 10,
    size: MonsterSizes.Small,
    inventory: new ItemsCollection(),
    naturalWeapon: NaturalWeaponFactory.getMonsterNaturalWeapon(
      MonstersTypes.GiantRat,
    ),
  },
};
