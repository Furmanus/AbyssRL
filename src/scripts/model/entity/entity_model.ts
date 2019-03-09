import {BaseModel} from '../../core/base_model';
import {IAnyObject} from '../../interfaces/common';
import {Cell} from '../dungeon/cells/cell_model';
import {LevelModel} from '../dungeon/level_model';

export class EntityModel extends BaseModel {
    /**
     * Visible sprite of entity. Member of file constants/sprites.js.
     */
    public display: string;
    /**
     * Level model where entity is.
     */
    public level: LevelModel;
    /**
     * Cell model where entity is.
     */
    public position: Cell;
    /**
     * Cell model where entity was in last turn.
     */
    public lastVisitedCell: Cell = null;
    /**
     * Speed statistic of entity.
     */
    public speed: number;
    /**
     * Perception statistics of entity.
     */
    public perception: number;
    /**
     * Array of cell model which are in entity field of view
     */
    public fov: Cell[] = [];
    /**
     * Description (usually text to display) of entity.
     */
    public description: string = 'unknown entity';

    constructor(config: IAnyObject) {
        super();

        this.display = config.display;
        this.level = config.level;
        this.position = config.position;
        this.lastVisitedCell = config.lastVisitedCell || null;
        this.speed = config.speed;
        this.perception = config.perception;
    }
    /**
     *
     * @param   newCell     New cell which entity will occupy.
     */
    public changePosition(newCell: Cell): void {
        this.position = newCell;
    }
    /**
     * Sets new fov array of entity.
     */
    public setFov(fovArray: Cell[]): void {
        this.setProperty('fov', fovArray);
    }
    /**
     * Returns speed of entity.
     */
    public getSpeed(): number {
        return this.speed;
    }
}
