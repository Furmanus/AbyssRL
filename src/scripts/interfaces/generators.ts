import { IDirection } from './common';

export interface ISmoothLevelConfig {
  cellsToSmooth: string[];
  cellsToChange: string[];
  cellsAfterChange: string[];
}
export interface IChangeEveryCellInLevelConfig {
  cellsToChange: string[];
  cellsAfterChange: string[];
  probability: number;
}
export interface ISearchCellSurroundingResult {
  directions: IDirection[];
}
export interface IFillLevelWithVoronoiPointConfig {
  targetCellType: string;
  cellAllowedToChange: string;
}
export interface IExaminedCellsClosestVoronoiPointType {
  distance: number;
  type: string;
}
export interface ICavernGenerateLevelConfig
  extends IDungeonStrategyGenerateLevelConfig {
  solidCellProbability?: number;
  born?: number[];
  survive?: number[];
}
export interface IDungeonStrategyGenerateLevelConfig {
  generateStairsDown?: boolean;
}
