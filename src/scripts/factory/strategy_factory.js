import {MAIN_DUNGEON} from '../constants/dungeon_types';
import {MainDungeonLevelGenerationStrategy} from "../strategy/dungeon_generator/main_dungeon_strategy";

const dungeonTypeToStrategy = {
    [MAIN_DUNGEON]: MainDungeonLevelGenerationStrategy
};

export function getDungeonStrategyInstance (dungeonType) {
    return new dungeonTypeToStrategy[dungeonType];
}