import {IEntity} from '../interfaces/entity_interfaces';
import {IAnyObject} from '../interfaces/common';
import {LevelModel} from '../model/dungeon/level_model';
import {Cell} from '../model/dungeon/cells/cell_model';
import {EntityController} from '../controller/entity/entity_controller';
import {MonsterController} from '../controller/entity/monster_controller';
import {MonsterModel} from '../model/entity/monster_model';
import {MonstersTypes} from '../constants/monsters';

interface IMonsterFactory {
    [key: string]: (config: IAnyObject) => IEntity;
}

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
};
