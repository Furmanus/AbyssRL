export enum DungeonTypes {
    MAIN_DUNGEON = 'main_dungeon',
}
export const dungeonTypeToName: {[P in DungeonTypes]: string} = {
    [DungeonTypes.MAIN_DUNGEON]: 'the Great Abyss',
};
