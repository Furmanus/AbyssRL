import {LevelModel} from '../model/dungeon/level_model';
import {Cell} from '../model/dungeon/cells/cell_model';
import {MonsterController} from '../controller/entity/monster_controller';
import {MonsterModel} from '../model/entity/monster_model';
import {MonstersTypes} from '../constants/monsters';
import {EntityGroupModel} from '../model/entity/entity_group_model';
import {getRandomNumber} from '../helper/rng';

interface IMonsterFactory {
    getGiantRatController: (level: LevelModel, startingPosition: Cell) => MonsterController;
    getOrcController: (level: LevelModel, startingPosition: Cell) => MonsterController;
    getGiantBatController: (level: LevelModel, startingPosition: Cell) => MonsterController;
    getGiantSpiderController: (level: LevelModel, startingPosition: Cell) => MonsterController;
    getPythonController: (level: LevelModel, startingPosition: Cell) => MonsterController;
    getHeadlessController: (level: LevelModel, startingPosition: Cell) => MonsterController;
    getSkeletonController: (level: LevelModel, startingPosition: Cell) => MonsterController;
    getTrollController: (level: LevelModel, startingPosition: Cell) => MonsterController;
    getEttinController: (level: LevelModel, startingPosition: Cell) => MonsterController;
    getRandomMonsterController: (level: LevelModel, startingPosition: Cell) => MonsterController;
}

export const monsterFactory: IMonsterFactory = {
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
    getGiantBatController(level: LevelModel, startingPosition: Cell): MonsterController {
        return new MonsterController({
            model: new MonsterModel({
                type: MonstersTypes.GIANT_BAT,
                position: startingPosition,
                level,
            }),
        });
    },
    getGiantSpiderController(level: LevelModel, startingPosition: Cell): MonsterController {
        return new MonsterController({
            model: new MonsterModel({
                type: MonstersTypes.GIANT_SPIDER,
                position: startingPosition,
                level,
            }),
        });
    },
    getPythonController(level: LevelModel, startingPosition: Cell): MonsterController {
        return new MonsterController({
            model: new MonsterModel({
                type: MonstersTypes.PYTHON,
                position: startingPosition,
                level,
            }),
        });
    },
    getHeadlessController(level: LevelModel, startingPosition: Cell): MonsterController {
        return new MonsterController({
            model: new MonsterModel({
                type: MonstersTypes.HEADLESS,
                position: startingPosition,
                level,
            }),
        });
    },
    getSkeletonController(level: LevelModel, startingPosition: Cell): MonsterController {
        return new MonsterController({
            model: new MonsterModel({
                type: MonstersTypes.SKELETON,
                position: startingPosition,
                level,
            }),
        });
    },
    getTrollController(level: LevelModel, startingPosition: Cell): MonsterController {
        return new MonsterController({
            model: new MonsterModel({
                type: MonstersTypes.TROLL,
                position: startingPosition,
                level,
            }),
        });
    },
    getEttinController(level: LevelModel, startingPosition: Cell): MonsterController {
        return new MonsterController({
            model: new MonsterModel({
                type: MonstersTypes.ETTIN,
                position: startingPosition,
                level,
            }),
        });
    },
    getRandomMonsterController(level: LevelModel, startingPosition: Cell): MonsterController {
        // @ts-ignore
        return monsterFactory[Object.keys(monsterFactory)[getRandomNumber(0, Object.keys(monsterFactory).length - 2)]](
            level, startingPosition,
        );
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
