import {Cell} from '../model/dungeon/cells/cell_model';
import {EntityController} from '../controller/entity/entity_controller';
import {
    MonstersTypes,
    MonsterSizes,
} from '../constants/monsters';
import {ItemsCollection} from '../collections/items_collection';
import {INaturalWeapon} from './combat';
import { LevelModel } from '../model/dungeon/level_model';

export interface IEntity {
    display: string;
    level: LevelModel;
    position: Cell;
    baseStrength: number;
    baseDexterity: number;
    baseToughness: number;
    baseIntelligence: number;
    baseSpeed: number;
    basePerception: number;
    fov: Cell[];
    description: string;
    type: MonstersTypes;
    isHostile: boolean;
    protection: number;
    hitPoints: number;
    maxHitPoints: number;
    size: MonsterSizes;
    inventory: ItemsCollection;
    naturalWeapon: INaturalWeapon;
}
export interface IEntityController {
    model: EntityController;
}
