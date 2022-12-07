import { Entity } from '../entities/entity';
import { MonsterEntity } from '../entities/monster.entity';
import { LevelModel } from '../../dungeon/models/level_model';
import { Cell } from '../../dungeon/models/cells/cell_model';

export interface IInitialConfigAi<
  C extends Entity = MonsterEntity,
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
export abstract class Ai<C extends Entity = MonsterEntity> implements IArtificialIntelligence {
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
      if (cell.entity && cell.entity.getModel() !== this.controller.getModel()) {
        filteredFov.entities.push(cell);
      }
    });

    return filteredFov;
  }
}
