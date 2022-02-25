export enum CellTypes {
  HighPeaks = 'high_peaks',
  Grass = 'grass',
  Mountain = 'mountain',
  GrayWall = 'gray_wall',
  RedFloor = 'red_floor',
  WoodenFloor = 'wooden_floor',
  WoodenSolidDoors = 'wooden_solid_doors',
  Hills = 'hills',
  LeftHills = 'left_hills',
  RightHills = 'right_hills',
  Lava = 'lava',
  Fountain = 'fountain',
  ShallowWater = 'shallow_water',
  DeepWater = 'deep_water',
  Bush = 'bush',
  Tree = 'tree',
  StairsUp = 'stairs_up',
  StairsDown = 'stairs_down',
  LadderDown = 'ladder_down',
  LadderUp = 'ladder_up',
  BedHead = 'left_bed',
  BedFoot = 'right_bed',
  Barrel = 'barrel',
  ChestOfDrawers = 'chest_drawers',
}

export const enum CellSpecialConditions {
  Bloody = 'blood',
  DriedBlood = 'dried_blood',
}

export const cellSpecialConditionToWalkMessage = {
  [CellSpecialConditions.Bloody]: 'There is a little pool of fresh blood here.',
  [CellSpecialConditions.DriedBlood]: 'Old blood stains are visible here.',
};
