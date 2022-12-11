import { Entity } from './entity';
import { MonsterModel } from '../models/monster.model';
import { MonsterAi } from '../ai/monsterAi';
import { MonstersTypes } from '../constants/monsters';
import { AnimalAi } from '../ai/animalAi';
import { LevelModel } from '../../dungeon/models/level_model';
import { Cell } from '../../dungeon/models/cells/cell_model';

interface IMonsterControllerConfig {
  model: MonsterModel;
}
type MonstersAi = typeof MonsterAi | typeof AnimalAi;

function getEntityAiStrategy(type: MonstersTypes): MonstersAi {
  switch (type) {
    case MonstersTypes.GiantRat:
      return AnimalAi;
    default:
      return MonsterAi;
  }
}

export class MonsterEntity extends Entity<MonsterModel> {
  private ai: MonsterAi;

  public constructor(config: IMonsterControllerConfig) {
    super();

    this.model = config.model;
    this.ai = new (getEntityAiStrategy(this.model.type))({
      controller: this,
    });
  }

  public act(): void {
    super.act();

    if (!this.isDead) {
      this.calculateFov();
      this.ai.performNextMove();
    }
  }

  public makeRandomMovement(): void {
    const levelModel: LevelModel = this.getLevelModel();
    const currentPosition: Cell = this.getEntityPosition();
    const nextCell: Cell = levelModel.getRandomNeighbourCallback(
      currentPosition,
      (candidate: Cell) => {
        return !candidate.blockMovement && !candidate.entity;
      },
    );

    if (nextCell) {
      this.move(nextCell);
    }
  }
}
