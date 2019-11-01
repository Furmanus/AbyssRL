import {Ai} from './ai';
import {MonsterController} from '../../controller/entity/monster_controller';
import {MonsterModel} from '../../model/entity/monster_model';
import {LevelModel} from '../../model/dungeon/level_model';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {ICoordinates} from '../../interfaces/common';
import {calculatePathToCell} from '../../helper/pathfinding_helper';

export class MonsterAi extends Ai<MonsterController> {
    public performNextMove(): void {
        super.performNextMove();
    }
    /**
     * Performs next entity idle move (movement when there is nothing interesting in entity FOV). Moves towards previously
     * selected target cell, or picking up new cell and moving towards it.
     */
    public performIdleTargetMove(): void {
        const {
            controller,
        } = this;
        const model: MonsterModel = controller.getModel() as MonsterModel;
        const levelModel: LevelModel = controller.getLevelModel();
        const entityPosition: Cell = model.position;
        let idleTarget: Cell = controller.getCurrentIdleTarget();
        let pathToTarget: ICoordinates[];

        if (entityPosition === idleTarget) {
            idleTarget = null;
        }

        if (!idleTarget) {
            while (!pathToTarget) {
                idleTarget = this.getNewIdleTarget();
                pathToTarget = calculatePathToCell(entityPosition, idleTarget, levelModel);
            }

            controller.setCurrentIdleTarget(idleTarget);
        } else {
            pathToTarget = calculatePathToCell(entityPosition, idleTarget, levelModel);
        }

        if (pathToTarget[1]) {
            controller.move(levelModel.getCell(pathToTarget[1].x, pathToTarget[1].y));
        } else {
            this.makeMoveInRandomDirection();
        }
    }
    private getNewIdleTarget(): Cell {
        const model: MonsterModel = this.controller.getModel() as MonsterModel;
        const levelModel: LevelModel = this.controller.getLevelModel();
        let idleTarget: Cell;
        let pathToTarget: ICoordinates[];

        while (!pathToTarget) {
            idleTarget = levelModel.getRandomUnoccupiedCell();
            pathToTarget = calculatePathToCell(model.position, idleTarget, levelModel);
        }

        return idleTarget;
    }
}
