import { MonsterAi } from './monsterAi';
import { Cell } from '../../dungeon/models/cells/cell_model';
import { IFilteredFov } from './ai';
import { MonstersTypes } from '../constants/monsters';
import { ICoordinates } from '../../interfaces/common';
import { calculatePathToCell } from '../../utils/pathfinding_helper';
import { LevelModel } from '../../dungeon/models/level_model';

export class AnimalAi extends MonsterAi {
  public performNextMove(): void {
    const fov: Cell[] = this.controller.getFov();
    const filteredFov: IFilteredFov = this.examineFov(fov);
    const entityPosition: Cell = this.controller.getEntityPosition();
    const levelModel: LevelModel = this.controller.getLevelModel();
    let entityPriority: Cell;
    let pathToTarget: ICoordinates[];

    filteredFov.entities.forEach((cell: Cell) => {
      const { entity } = cell;

      if (entity.type === MonstersTypes.Player) {
        entityPriority = cell;
      }
    });

    if (entityPriority) {
      pathToTarget = calculatePathToCell(
        entityPosition,
        entityPriority,
        levelModel,
      );

      if (pathToTarget && pathToTarget.length > 1) {
        this.controller.move(
          levelModel.getCell(pathToTarget[1].x, pathToTarget[1].y),
        );
      } else if (pathToTarget && pathToTarget.length === 1) {
        // placeholder
      } else {
        this.controller.makeRandomMovement();
      }
    } else {
      this.controller.makeRandomMovement();
    }
  }
}
