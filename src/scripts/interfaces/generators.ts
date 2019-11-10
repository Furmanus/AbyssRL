import {IDirection} from './common';
import {CellTypes} from '../constants/cell_types';

export interface ISmoothLevelConfig {
    cellsToSmooth: CellTypes[];
    cellsToChange: CellTypes[];
    cellsAfterChange: CellTypes[];
}
export interface IChangeEveryCellInLevelConfig {
    cellsToChange: CellTypes[];
    cellsAfterChange: CellTypes[];
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
    type: CellTypes;
}
export interface ICavernGenerateLevelConfig extends IDungeonStrategyGenerateLevelConfig {
    solidCellProbability?: number;
    born?: number[];
    survive?: number[];
}
export interface IDungeonStrategyGenerateLevelConfig {
    generateStairsDown?: boolean;
}
