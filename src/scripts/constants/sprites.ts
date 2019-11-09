export const entities = {
    FIGHTER: 'fighter',
    WIZARD: 'wizard',
    ROGUE: 'rogue',
    AVATAR: 'avatar',
    VILLAGER: 'villager',
    MERCHANT: 'merchant',
    JESTER: 'jester',
    MINSTREL: 'minstrel',
    MAN_IN_STOCKS: 'man_in_stocks',
    CHAINED_MAN: 'chained_man',
    CHILD: 'child',
    BEGGAR: 'beggar',
    GUARD: 'guard',
    GOOD_SPIRIT: 'good_spirit',
    BLACKTHORN: 'blackthorn',
    SEAHORSE: 'seahorse',
    SQUID: 'squid',
    SEA_SERPENT: 'sea_serpent',
    SHARK: 'shark',
    GIANT_RAT: 'giant_rat',
    GHOST: 'ghost',
    SLIME: 'slime',
    GREMLIN: 'gremlin',
    MIMIC: 'mimic',
    REAPER: 'reaper',
    GAZER: 'gazer',
    GARGOYLE: 'gargoyle',
    INSECTS: 'insects',
    ORC: 'orc',
    SKELETON: 'skeleton',
    SNAKE: 'snake',
    ETTIN: 'ettin',
    HEADLESS: 'headless',
    WISP: 'wisp',
    DAEMON: 'daemon',
    DRAGON: 'dragon',
    SANDTRAP: 'sandtrap',
    TROLL: 'troll',
    MONGBAT: 'mongbat',
    CORPSER: 'corpser',
    WORMS: 'worms',
    SHADOWLORD: 'shadowlord',
    GIANT_BAT: 'giant_bat',
    GIANT_SPIDER: 'giant_spider',
};
export enum TerrainSprites {
    RED_FLOOR = 'red_brick_floor',
    WOODEN_FLOOR_1 = 'wooden_floor1',
    WOODEN_FLOOR_2 = 'wooden_floor2',
    WOODEN_DOORS = 'doors',
    GRAY_WALL = 'gray_wall',
    HIGH_PEAKS = 'high_peaks',
    MOUNTAIN = 'mountains',
    GRASS_1 = 'grass1',
    GRASS_2 = 'grass2',
    FOUNTAIN = 'fountain',
    LAVA = 'lava',
    HILLS = 'hills',
    LEFT_HILLS = 'left_hills',
    RIGHT_HILLS = 'right_hills',
    SHALLOW_WATER = 'shallow_water',
    DEEP_WATER_1 = 'deep_water',
    DEEP_WATER_2 = 'deep_water2',
    NORTH_COASTLINE = 'north_coastline',
    EAST_COASTLINE = 'east_coastline',
    WEST_COASTLINE = 'west_coastline',
    SOUTH_COASTLINE = 'south_coastline',
    NORTHEAST_COASTLINE = 'north_east_coastline',
    NORTHWEST_COASTLINE = 'north_west_coastline',
    SOUTHEAST_COASTLINE = 'south_east_coastline',
    SOUTHWEST_COASTLINE = 'south_west_coastline',
    THICK_BUSH = 'thick_bush',
    TREE = 'tree',
    STAIRS_UP = 'stairs_up',
    STAIRS_DOWN = 'stairs_down',
}
export const miscTiles = {
    explosion: 'explosion',
};
export enum DungeonFeaturesSprites {
    BED_HEAD = 'left_bed',
    BED_FOOT = 'right_bed',
    BARREL = 'barrel',
    CHEST_OF_DRAWERS = 'chest_drawers',
}
export enum ItemSprites {
    WEAPON = 'weapon',
    ARMOUR = 'armour',
    RING = 'ring',
    AMULET = 'necklace',
}
export type DungeonTerrainSprites = DungeonFeaturesSprites & TerrainSprites;
