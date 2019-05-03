import {BaseModel} from '../../core/base_model';
import {IAnyObject} from '../../interfaces/common';
import {Cell} from '../dungeon/cells/cell_model';
import {LevelModel} from '../dungeon/level_model';
import {EntityEvents} from '../../constants/entity_events';
import {IEntity} from '../../interfaces/entity_interfaces';

export class EntityModel extends BaseModel implements IEntity {
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
    public strength: number;
    public dexterity: number;
    public toughness: number;
    public intelligence: number;
    /**
     * Speed statistic of entity. Important stat, used by time engine to calculate how often entity should act.
     */
    public speed: number;
    public perception: number;
    /**
     * Array of cell model which are in entity field of view
     */
    public fov: Cell[] = [];
    /**
     * Description (usually text to display) of entity.
     */
    public description: string = 'unknown entity';
    /**
     * Type of entity.
     */
    public type: string = 'unknown_entity';
    /**
     * Is entity hostile to player.
     */
    public isHostile: boolean = false;
    public hitPoints: number;
    public maxHitPoints: number;

    constructor(config: IAnyObject) {
        super();

        this.display = config.display;
        this.level = config.level;
        this.position = config.position;
        this.lastVisitedCell = config.lastVisitedCell || null;
        this.speed = config.speed;
        this.perception = config.perception;
        this.type = config.type;
    }
    /**
     * Changes position property of entity.
     *
     * @param   newCell     New cell which entity will occupy.
     */
    public changePosition(newCell: Cell): void {
        this.setProperty('position', newCell);
    }
    /**
     * Changes level property and position property of entity.
     *
     * @param level         New entity level
     */
    public changeLevel(level: LevelModel): void {
        this.setProperty('level', level);
    }
    /**
     * Sets new fov array of entity.
     */
    public setFov(fovArray: Cell[]): void {
        this.setProperty('fov', fovArray);
    }
    /**
     * Changes position and lastVisitedCell properties of entity. Also changes properties of appriopiate cells (clears
     * entity property on old cell, and sets entity property on new cell).
     *
     * @param newCell   New cell where entity currently is
     */
    public move(newCell: Cell): void {
        this.lastVisitedCell = this.position; // remember on what cell entity was in previous turn
        this.position.clearEntity(); // we clear entity field of cell which entity is right now at
        this.position = newCell; // we move entity to new position
        /**
         * in new cell model where monster is after movement, we store information about new entity occupying new cell.
         */
        this.position.setEntity(this);
        this.notify(EntityEvents.ENTITY_MOVE, newCell);
    }
    /**
     * Returns speed of entity.
     */
    public getSpeed(): number {
        return this.speed;
    }
}
