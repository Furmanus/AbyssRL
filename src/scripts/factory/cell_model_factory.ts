import {CellTypes} from '../constants/cell_types';
import {FloorModel} from '../model/dungeon/cells/floor_model';
import {cellsDescriptions} from '../helper/cells_description';
import {TerrainSprites} from '../constants/sprites';
import {WallModel} from '../model/dungeon/cells/wall_model';
import {WoodenSolidDoorModel} from '../model/dungeon/cells/doors/wooden_solid_door';
import {LavaCellModel} from '../model/dungeon/cells/lava_model';
import {FountainModel} from '../model/dungeon/cells/fountain_model';
import {ShallowWater} from '../model/dungeon/cells/shallow_water';
import {DeepWater} from '../model/dungeon/cells/deep_water';
import {BushModel} from '../model/dungeon/cells/floors/bush_model';
import {TreeModel} from '../model/dungeon/cells/tree_model';
import {StairsModel} from '../model/dungeon/cells/floors/stairs';
import {StairDirections} from '../constants/stairs_directions';
import {Cell} from '../model/dungeon/cells/cell_model';
import {BedHead} from '../model/dungeon/cells/special/bed_head';
import {BedFoot} from '../model/dungeon/cells/special/bed_foot';
import {BarrelModel} from '../model/dungeon/cells/special/barrel';
import {ChestOfDrawersModel} from '../model/dungeon/cells/special/chest_of_drawers_model';
import {ICellConstructorConfig} from '../interfaces/cell';

export const CellModelFactory = {
    getCellModel(x: number, y: number, type: string, config: ICellConstructorConfig): Cell {
        switch (type) {
            case CellTypes.RED_FLOOR:
                return CellModelFactory.getRedFloorCell(x, y, config);
            case CellTypes.WOODEN_FLOOR:
                return CellModelFactory.getWoodenFloor(x, y, config);
            case CellTypes.GRASS:
                return CellModelFactory.getGrassFloor(x, y, config);
            case CellTypes.GRAY_WALL:
                return CellModelFactory.getGrayWallModel(x, y, config);
            case CellTypes.HIGH_PEAKS:
                return CellModelFactory.getHighPeaksWallModel(x, y, config);
            case CellTypes.MOUNTAIN:
                return CellModelFactory.getMountainWallModel(x, y, config);
            case CellTypes.HILLS:
                return CellModelFactory.getHillsFloorModel(x, y, config);
            case CellTypes.LEFT_HILLS:
                return CellModelFactory.getLefttHillsFloorModel(x, y, config);
            case CellTypes.RIGHT_HILLS:
                return CellModelFactory.getRightHillsFloorModel(x, y, config);
            case CellTypes.WOODEN_SOLID_DOORS:
                return CellModelFactory.getWoodenSolidDoors(x, y, config);
            case CellTypes.LAVA:
                return CellModelFactory.getLavaFloorModel(x, y, config);
            case CellTypes.FOUNTAIN:
                return CellModelFactory.getFountainModel(x, y, config);
            case CellTypes.SHALLOW_WATER:
                return CellModelFactory.getShallowWater(x, y, config);
            case CellTypes.DEEP_WATER:
                return CellModelFactory.getDeepWater(x, y, config);
            case CellTypes.BUSH:
                return CellModelFactory.getBush(x, y, config);
            case CellTypes.TREE:
                return CellModelFactory.getTree(x, y, config);
            case CellTypes.STAIRS_DOWN:
                return CellModelFactory.getStairsDown(x, y, config);
            case CellTypes.STAIRS_UP:
                return CellModelFactory.getStairsUp(x, y, config);
            case CellTypes.BED_HEAD:
                return CellModelFactory.getBedHead(x, y, config);
            case CellTypes.BED_FOOT:
                return CellModelFactory.getBedFoot(x, y, config);
            case CellTypes.BARREL:
                return CellModelFactory.getBarrelModel(x, y, config);
            case CellTypes.CHEST_OF_DRAWERS:
                return CellModelFactory.getChestOfDrawersModel(x, y, config);
            default:
                throw new Error('Unknown cell type in cell model factory.');
        }
    },
    getRedFloorCell(x: number, y: number, config: ICellConstructorConfig): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                ...config,
                type: CellTypes.RED_FLOOR,
                description: cellsDescriptions[CellTypes.RED_FLOOR],
                display: [TerrainSprites.RED_FLOOR],
            },
        );
    },
    getWoodenFloor(x: number, y: number, config: ICellConstructorConfig): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                ...config,
                type: CellTypes.WOODEN_FLOOR,
                description: cellsDescriptions[CellTypes.WOODEN_FLOOR],
                display: [TerrainSprites.WOODEN_FLOOR_1, TerrainSprites.WOODEN_FLOOR_2],
            },
        );
    },
    getGrassFloor(x: number, y: number, config: ICellConstructorConfig): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                ...config,
                type: CellTypes.GRASS,
                description: cellsDescriptions[CellTypes.GRASS],
                display: [TerrainSprites.GRASS_2],
            },
        );
    },
    getGrayWallModel(x: number, y: number, config: ICellConstructorConfig): WallModel {
        return new WallModel(
            x,
            y,
            {
                ...config,
                type: CellTypes.GRAY_WALL,
                description: cellsDescriptions[CellTypes.GRAY_WALL],
                display: [TerrainSprites.GRAY_WALL],
            },
        );
    },
    getHighPeaksWallModel(x: number, y: number, config: ICellConstructorConfig): WallModel {
        return new WallModel(
            x,
            y,
            {
                ...config,
                type: CellTypes.HIGH_PEAKS,
                description: cellsDescriptions[CellTypes.HIGH_PEAKS],
                display: [TerrainSprites.HIGH_PEAKS],
            },
        );
    },
    getMountainWallModel(x: number, y: number, config: ICellConstructorConfig): WallModel {
        return new WallModel(
            x,
            y,
            {
                ...config,
                type: CellTypes.MOUNTAIN,
                description: cellsDescriptions[CellTypes.MOUNTAIN],
                display: [TerrainSprites.MOUNTAIN],
            },
        );
    },
    getHillsFloorModel(x: number, y: number, config: ICellConstructorConfig): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                ...config,
                type: CellTypes.HILLS,
                description: cellsDescriptions[CellTypes.HILLS],
                display: [TerrainSprites.HILLS],
            },
        );
    },
    getRightHillsFloorModel(x: number, y: number, config: ICellConstructorConfig): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                ...config,
                type: CellTypes.RIGHT_HILLS,
                description: cellsDescriptions[CellTypes.HILLS],
                display: [TerrainSprites.RIGHT_HILLS],
            },
        );
    },
    getLefttHillsFloorModel(x: number, y: number, config: ICellConstructorConfig): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                ...config,
                type: CellTypes.LEFT_HILLS,
                description: cellsDescriptions[CellTypes.HILLS],
                display: [TerrainSprites.LEFT_HILLS],
            },
        );
    },
    getWoodenSolidDoors(x: number, y: number, config: ICellConstructorConfig): WoodenSolidDoorModel {
        return new WoodenSolidDoorModel(x, y, config);
    },
    getLavaFloorModel(x: number, y: number, config: ICellConstructorConfig): LavaCellModel {
        return new LavaCellModel(x, y, config);
    },
    getFountainModel(x: number, y: number, config: ICellConstructorConfig): FountainModel {
        return new FountainModel(x, y, config);
    },
    getShallowWater(x: number, y: number, config: ICellConstructorConfig): ShallowWater {
        return new ShallowWater(x, y, config);
    },
    getDeepWater(x: number, y: number, config: ICellConstructorConfig): DeepWater {
        return new DeepWater(x, y, config);
    },
    getBush(x: number, y: number, config: ICellConstructorConfig): BushModel {
        return new BushModel(x, y, config);
    },
    getTree(x: number, y: number, config: ICellConstructorConfig): TreeModel {
        return new TreeModel(x, y, config);
    },
    getStairsUp(x: number, y: number, config: ICellConstructorConfig): StairsModel {
        return new StairsModel(x, y, {
            ...config,
            direction: StairDirections.UP,
        });
    },
    getStairsDown(x: number, y: number, config: ICellConstructorConfig): StairsModel {
        return new StairsModel(x, y, {
            ...config,
            direction: StairDirections.DOWN,
        });
    },
    getBedHead(x: number, y: number, config: ICellConstructorConfig): BedHead {
        return new BedHead(x, y, config);
    },
    getBedFoot(x: number, y: number, config: ICellConstructorConfig): BedFoot {
        return new BedFoot(x, y, config);
    },
    getBarrelModel(x: number, y: number, config: ICellConstructorConfig): BarrelModel {
        return new BarrelModel(x, y, config);
    },
    getChestOfDrawersModel(x: number, y: number, config: ICellConstructorConfig): ChestOfDrawersModel {
        return new ChestOfDrawersModel(x, y, config);
    },
};
