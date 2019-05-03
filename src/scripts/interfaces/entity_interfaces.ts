import {LevelModel} from '../model/dungeon/level_model';
import {Cell} from '../model/dungeon/cells/cell_model';
import {EntityController} from '../controller/entity/entity_controller';

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
    type: string;
    isHostile: boolean;
}
export interface IEntiryController {
    model: EntityController;
}
