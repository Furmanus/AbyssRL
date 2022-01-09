import { LevelModel } from '../../model/dungeon/level_model';
import { Cell } from '../../model/dungeon/cells/cell_model';
import { EntityController } from '../../controller/entity/entity_controller';
import { MonstersTypes, MonsterSizes } from '../../constants/entity/monsters';
import { ItemsCollection } from '../../collections/items_collection';
import { INaturalWeapon, IWeapon } from '../combat';
import { WeaponModel } from '../../model/items/weapons/weapon_model';
import { PlayerEquipSlots } from '../../constants/entity/inventory';
import { ItemModel } from '../../model/items/item_model';
import { ArmourModel } from '../../model/items/armours/armour_model';
import { NaturalWeaponModel } from '../../model/items/weapons/natural_weapon_model';
import { EntityDungeonPosition } from '../../model/entity/entity_model';

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
  model: EntityController;
}

export interface IPlayerEquipSlotsType {
  [PlayerEquipSlots.Body]: ArmourModel;
  [PlayerEquipSlots.RightHand]: WeaponModel;
}

export interface IActor {
  act: () => void;
  getSpeed: () => number;
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
