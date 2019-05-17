import {LevelModel} from '../model/dungeon/level_model';
import {Cell} from '../model/dungeon/cells/cell_model';
import {EntityController} from '../controller/entity/entity_controller';
import {
    MonstersTypes,
    MonsterSizes,
    MonsterAttackTypes,
} from '../constants/monsters';
import {ItemsCollection} from '../collections/items_collection';
import {Dice} from '../model/dice';

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
    baseDamage: Dice;
    baseAttackType: MonsterAttackTypes;
}
export interface IEntityController {
    model: EntityController;
}
