import {EntityController} from '../../controller/entity/entity_controller';
import {MonsterController} from '../../controller/entity/monster_controller';
import {LevelModel} from '../../model/dungeon/level_model';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {MonstersTypes} from '../../constants/monsters';
import {EntityModel} from '../../model/entity/entity_model';
import {calculatePathToCell} from '../../helper/pathfinding_helper';
import {ICoordinates} from '../../interfaces/common';

export interface IInitialConfigAi<C extends EntityController = MonsterController> {
    controller: C;
}
export interface IFilteredFov {
    entities: Cell[];
    items: Cell[];
}
export interface IArtificialIntelligence {
    performNextMove: () => void;
}
export interface IHostilesWithDistance {
    entity: EntityModel;
    path: ICoordinates[];
}
/**
 * Abstract class containing AI algorithms and methods for game entities. Class contains common methods for all types
 * of AI present in game.
 */
export abstract class Ai<C extends EntityController = MonsterController> implements IArtificialIntelligence {
    /**
     * Controller of entity, which behaviour needs to be calculated by this strategy.
     */
    protected controller: C;

    constructor(config: IInitialConfigAi<C>) {
        this.controller = config.controller;
    }
    /**
     * Method responsible for calculating and performing next movement by entity. Implemented properly in deritive
     * classes, this fallback option makes simplest random movement.
     */
    public performNextMove(): void {
        this.makeMoveInRandomDirection();
    }
    protected examineFov(fov: Cell[]): IFilteredFov {
        const filteredFov: IFilteredFov = {
            entities: [],
            items: [],
        };

        fov.forEach((cell: Cell) => {
            if (cell.entity && cell.entity !== this.controller.getModel()) {
                filteredFov.entities.push(cell);
            }
        });

        return filteredFov;
    }
    protected makeMoveInRandomDirection(): void {
        const levelModel: LevelModel = this.controller.getLevelModel();
        const currentPosition: Cell = this.controller.getEntityPosition();
        const nextCell: Cell = levelModel.getRandomNeighbourCallback(currentPosition, (candidate: Cell) => {
            return (!candidate.blockMovement && ! candidate.entity);
        });

        if (nextCell) {
            this.controller.move(nextCell);
        }
    }
    protected getMonsterEnemiesList(): MonstersTypes[] {
        const model: EntityModel = this.controller.getModel();

        switch (model.type) {
            case MonstersTypes.GIANT_RAT:
                return [MonstersTypes.PLAYER, MonstersTypes.ORC];
            case MonstersTypes.ORC:
                return [MonstersTypes.PLAYER, MonstersTypes.GIANT_RAT];
            default:
                return [];
        }
    }
    public getHostilesWithDistance(entities: EntityModel[]): IHostilesWithDistance[] {
        const hostileList: MonstersTypes[] = this.getMonsterEnemiesList();
        const model: EntityModel = this.controller.getModel();
        const levelModel: LevelModel = this.controller.getLevelModel();

        return entities.filter((entity: EntityModel) => hostileList.includes(entity.type)).map((entity: EntityModel) => {
            return {
                path: calculatePathToCell(model.position, entity.position, levelModel),
                entity,
            };
        }).sort((first, second) => first.path.length - second.path.length);
    }
}
