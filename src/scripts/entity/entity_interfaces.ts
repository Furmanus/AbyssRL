import { LevelModel } from '../dungeon/models/level_model';
import { Cell } from '../dungeon/models/cells/cell_model';
import { Entity } from './entities/entity';
import { MonstersTypes, MonsterSizes } from './constants/monsters';
import { ItemsCollection } from '../items/items_collection';
import { WeaponModel } from '../items/models/weapons/weapon.model';
import { PlayerEquipSlots } from './constants/inventory';
import { ArmourModel } from '../items/models/armours/armour_model';
import { NaturalWeaponModel } from '../items/models/weapons/naturalWeapon.model';
import { EntityDungeonPosition } from './models/entity.model';

export interface IEntity {
  display: string;
  level: LevelModel;
  position: Cell;
  lastVisitedCell: Cell;
  strength: number;
  dexterity: number;
  toughness: number;
  intelligence: number;
  speed: number;
  perception: number;
  fov: Cell[];
  description: string;
  type: MonstersTypes;
  isHostile: boolean;
  protection: number;
  hitPoints: number;
  maxHitPoints: number;
  size: MonsterSizes;
  inventory: ItemsCollection;
  equippedWeapon: WeaponModel;
  naturalWeapon: NaturalWeaponModel;
}
export interface IEntityController {
  model: Entity;
}

export interface IPlayerEquipSlotsType {
  [PlayerEquipSlots.Body]: ArmourModel;
  [PlayerEquipSlots.RightHand]: WeaponModel;
}

export interface IActor {
  act: () => void;
  getSpeed: () => number;
  getId: () => string;
  destroy: () => void;
}

export function isEntityPosition(obj: unknown): obj is EntityDungeonPosition {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'branch' in obj &&
    'level' in obj &&
    'position' in obj
  );
}
