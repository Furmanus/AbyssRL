import { LevelModel } from '../model/dungeon/level_model';
import { Cell } from '../model/dungeon/cells/cell_model';
import { MonsterController } from '../controller/entity/monster_controller';
import { MonsterModel } from '../model/entity/monster_model';
import { Monsters, MonstersTypes } from '../constants/monsters';

export class MonsterFactory {
  public static getMonsterControllerByType(
    type: Monsters,
    level: LevelModel,
    startingPosition: Cell,
  ): MonsterController {
    if (type in monsterTypeToFactoryMethod) {
      return monsterTypeToFactoryMethod[type](level, startingPosition);
    }

    throw new Error('Invalid monster type');
  }

  public static getGiantRatController(
    level: LevelModel,
    startingPosition: Cell,
  ): MonsterController {
    return new MonsterController({
      model: new MonsterModel({
        type: MonstersTypes.GiantRat,
        position: startingPosition,
        level,
      }),
    });
  }
}

const monsterTypeToFactoryMethod = {
  [Monsters.GiantRat]: MonsterFactory.getGiantRatController,
};
