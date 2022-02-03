import { EntityController } from './entity_controller';
import { MonsterModel } from '../../model/entity/monster_model';
import { MonsterAi } from '../../strategy/ai/monster_ai';
import { MonstersTypes } from '../../constants/entity/monsters';
import { AnimalAi } from '../../strategy/ai/animal_ai';
import { LevelController } from '../dungeon/level_controller';
import { LevelModel } from '../../model/dungeon/level_model';
import { Cell } from '../../model/dungeon/cells/cell_model';
import { PlayerController } from './player_controller';

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
    /** Below if is temporary hack. It is required because when recovering game state from saved data, there is no
     *  serialized time engine there. At recreation of level each entity is put to new instance of scheduler, which result
     *  of monsters taking free move after loading game. TODO find way to serialize time engine, restore it upon loading
     *  game and remove below if
     */
    if (PlayerController.getInstance().hasMoved) {
      super.act();

      if (!this.isDead) {
        this.calculateFov();
        this.ai.performNextMove();
      }
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
