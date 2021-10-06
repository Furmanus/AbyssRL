import { EntityController } from './entity_controller';
import { MonsterModel } from '../../model/entity/monster_model';
import { MonsterAi } from '../../strategy/ai/monster_ai';
import { MonstersTypes } from '../../constants/entity/monsters';
import { AnimalAi } from '../../strategy/ai/animal_ai';
import { LevelController } from '../dungeon/level_controller';

interface IMonsterControllerConfig {
  model: MonsterModel;
  levelController: LevelController;
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
    super(config);

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
    // TODO zbadac czemu w widoku gry czasami przy bleedingu zostaje gif otrzymania rany
    if (!this.isDead) {
      this.calculateFov();
      this.ai.performNextMove();
    }
  }
}
