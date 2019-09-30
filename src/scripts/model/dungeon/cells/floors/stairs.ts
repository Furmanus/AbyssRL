import {Cell} from '../cell_model';
import {CellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {TerrainSprites} from '../../../../constants/sprites';
import * as Utility from '../../../../helper/utility';
import {IAnyObject} from '../../../../interfaces/common';
import {ICellConstructorConfig, IStairsCellConstructorConfig} from '../../../../interfaces/cell';
import {StairDirections} from '../../../../constants/stairs_directions';

export class StairsModel extends Cell {
    private readonly areStairsUp: string;
    /**
     * @param   x                   Horizontal position on level grid.
     * @param   y                   Vertical position on level grid.
     * @param   config              Configuration object.
     * @param   config.direction    Direction of stairs - either up or down.
     */
    constructor(x: number, y: number, config: IStairsCellConstructorConfig) {
        super(x, y, config);

        this.type = config.direction === StairDirections.UP ? CellTypes.STAIRS_UP : CellTypes.STAIRS_DOWN;
        this.description = cellsDescriptions[this.type];

        this.areStairsUp = config.direction;
    }
    get display(): string {
        return this.areStairsUp === StairDirections.UP ? TerrainSprites.STAIRS_UP : TerrainSprites.STAIRS_DOWN;
    }
    get walkMessage(): string {
        return Utility.capitalizeString(`${this.description} is here.`);
    }
}
