import { LevelModel } from '../model/dungeon/level_model';
import { Cell } from '../model/dungeon/cells/cell_model';
import { MonsterController } from '../controller/entity/monster_controller';
import { MonsterModel } from '../model/entity/monster_model';
import { MonstersTypes } from '../constants/monsters';

export const monsterFactory = {
  getGiantRatController(
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
  },
};
