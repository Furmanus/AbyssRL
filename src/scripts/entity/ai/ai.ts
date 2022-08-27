import { EntityController } from '../controllers/entity.controller';
import { MonsterController } from '../controllers/monster.controller';
import { LevelModel } from '../../dungeon/models/level_model';
import { Cell } from '../../dungeon/models/cells/cell_model';

export interface IInitialConfigAi<
  C extends EntityController = MonsterController,
> {
  controller: C;
}
export interface IFilteredFov {
  entities: Cell[];
  items: Cell[];
}
export interface IArtificialIntelligence {
  performNextMove: () => void;
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
    this.controller.makeRandomMovement();
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
}
