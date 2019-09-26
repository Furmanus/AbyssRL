import {IEntity} from '../interfaces/entity_interfaces';
import {IAnyObject} from '../interfaces/common';
import {Cell} from '../model/dungeon/cells/cell_model';
import {MonsterController} from '../controller/entity/monster_controller';
import {MonsterModel} from '../model/entity/monster_model';
import {MonstersTypes} from '../constants/monsters';

interface IMonsterFactory {
    [key: string]: (config: IAnyObject) => IEntity;
}

export const monsterFactory = {
    getGiantRatController(levelId: string, startingPosition: Cell): MonsterController {
        return new MonsterController({
            model: new MonsterModel({
                type: MonstersTypes.GIANT_RAT,
                position: startingPosition,
                levelId,
            }),
        });
    },
};
