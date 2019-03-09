import {MAIN_DUNGEON} from '../constants/dungeon_types';
import {MainDungeonLevelGenerationStrategy} from "../strategy/dungeon_generator/main_dungeon_strategy";
import {IAnyObject} from '../interfaces/common';

const dungeonTypeToStrategy: IAnyObject = {
    [MAIN_DUNGEON]: MainDungeonLevelGenerationStrategy,
};

export function getDungeonStrategyInstance<M = MainDungeonLevelGenerationStrategy>(dungeonType: string): M {
    // tslint:disable-next-line:new-parens
    return new dungeonTypeToStrategy[dungeonType];
}
