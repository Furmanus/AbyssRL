import { LevelModel } from '../model/dungeon/level_model';
import { Cell } from '../model/dungeon/cells/cell_model';
import { MonsterController } from '../controller/entity/monster_controller';
import { MonsterModel } from '../model/entity/monster_model';
import { Monsters, MonstersTypes } from '../constants/entity/monsters';
import { LevelController } from '../controller/dungeon/level_controller';
import { Position, SerializedPosition } from '../model/position/position';
import { dungeonState } from '../state/application.state';

const partialDefaultMonsterConfig = {
  strength: 0,
  dexterity: 0,
  toughness: 0,
  intelligence: 0,
  perception: 0,
  speed: 0,
  protection: 0,
};

export class MonsterFactory {
  public static getMonsterControllerByType(
    type: Monsters,
    startingPosition: Cell,
  ): MonsterController {
    if (type in monsterTypeToFactoryMethod) {
      return monsterTypeToFactoryMethod[type](startingPosition);
    }

    throw new Error('Invalid monster type');
  }

  public static getGiantRatController(
    startingPosition: SerializedPosition,
  ): MonsterController {
    return new MonsterController({
      model: new MonsterModel({
        type: MonstersTypes.GiantRat,
        position: {
          branch: dungeonState.currentBranch,
          level: dungeonState.currentLevelNumber,
          position: new Position(startingPosition.x, startingPosition.y),
        },
        ...partialDefaultMonsterConfig,
      }),
    });
  }
}

const monsterTypeToFactoryMethod = {
  [Monsters.GiantRat]: MonsterFactory.getGiantRatController,
};
