import { EntityController } from './entity_controller';
import { MonsterModel } from '../../model/entity/monster_model';
import { MonsterAi } from '../../strategy/ai/monster_ai';
import { MonstersTypes } from '../../constants/entity/monsters';
import { AnimalAi } from '../../strategy/ai/animal_ai';
import { LevelController } from '../dungeon/level_controller';
import { LevelModel } from '../../model/dungeon/level_model';
import { Cell } from '../../model/dungeon/cells/cell_model';

interface IMonsterControllerConfig {
  model: MonsterModel;
}
type monstersAi = typeof MonsterAi | typeof AnimalAi;

function getEntityAiStrategy(type: MonstersTypes): monstersAi {
  switch (type) {
    case MonstersTypes.GiantRat:
      return AnimalAi;
    default:
      return MonsterAi;
  }
}

export class MonsterController extends EntityController<MonsterModel> {
  private ai: MonsterAi;

  public constructor(config: IMonsterControllerConfig) {
    super();

    this.model = config.model;
    this.ai = new (getEntityAiStrategy(this.model.type))({
      controller: this,
    });

    this.attachEvents();
  }

  protected attachEvents(): void {
    super.attachEvents();
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
