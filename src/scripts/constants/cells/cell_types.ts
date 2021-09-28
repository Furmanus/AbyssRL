export const cellTypes = {
  HIGH_PEAKS: 'high_peaks',
  GRASS: 'grass',
  MOUNTAIN: 'mountain',
  GRAY_WALL: 'gray_wall',
  RED_FLOOR: 'red_floor',
  WOODEN_FLOOR: 'wooden_floor',
  WOODEN_SOLID_DOORS: 'wooden_solid_doors',
  HILLS: 'hills',
  LEFT_HILLS: 'left_hills',
  RIGHT_HILLS: 'right_hills',
  LAVA: 'lava',
  FOUNTAIN: 'fountain',
  SHALLOW_WATER: 'shallow_water',
  DEEP_WATER: 'deep_water',
  BUSH: 'bush',
  TREE: 'tree',
  STAIRS_UP: 'stairs_up',
  STAIRS_DOWN: 'stairs_down',
  LADDER_DOWN: 'ladder_down',
  LADDER_UP: 'ladder_up',
  BED_HEAD: 'left_bed',
  BED_FOOT: 'right_bed',
  BARREL: 'barrel',
  CHEST_OF_DRAWERS: 'chest_drawers',
};

export const enum CellSpecialConditions {
  Bloody = 'blood',
  DriedBlood = 'dried_blood',
}

export const cellSpecialConditionToWalkMessage = {
  [CellSpecialConditions.Bloody]: 'There is a little pool of fresh blood here.',
  [CellSpecialConditions.DriedBlood]: 'Old blood stains are visible here.',
};
