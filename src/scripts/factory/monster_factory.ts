import {LevelModel} from '../model/dungeon/level_model';
import {Cell} from '../model/dungeon/cells/cell_model';
import {MonsterController} from '../controller/entity/monster_controller';
import {MonsterModel} from '../model/entity/monster_model';
import {MonstersTypes} from '../constants/monsters';
import {EntityGroupModel} from '../model/entity/entity_group_model';

export const monsterFactory = {
    getGiantRatController(level: LevelModel, startingPosition: Cell): MonsterController {
        return new MonsterController({
            model: new MonsterModel({
                type: MonstersTypes.GIANT_RAT,
                position: startingPosition,
                level,
            }),
        });
    },
    getOrcController(level: LevelModel, startingPosition: Cell): MonsterController {
        return new MonsterController({
            model: new MonsterModel({
                type: MonstersTypes.ORC,
                position: startingPosition,
                level,
            }),
        });
    },
};
export const monsterGroupsFactory = {
    getOrcPack(level: LevelModel, leaderPosition: Cell): EntityGroupModel {
        const followersCells: Cell[] = level.getRandomUnocuppiedCellsWithinRangeFromCell(leaderPosition, 4, 4);
        const monsters: MonsterController[] = [];

        for (let i = 0; i < 4; i++) {
            const position: Cell = i === 0 ? leaderPosition : followersCells[i];
            const controller: MonsterController = monsterFactory.getOrcController(level, position);

            monsters.push(controller);
        }

        return new EntityGroupModel(monsters, monsters[0]);
    },
};
