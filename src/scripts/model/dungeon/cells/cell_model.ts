/**
 * Created by Docent Furman on 16.07.2017.
 */

import {WalkAttemptResult} from './effects/walk_attempt_result';
import {UseAttemptResult} from './effects/use_attempt_result';
import {UseEffectResult} from './effects/use_effect_result';
import {IAnyObject} from '../../../interfaces/common';
import {BaseModel} from '../../../core/base_model';
import {EntityModel} from '../../entity/entity_model';
import {EntityController} from '../../../controller/entity/entity_controller';
import {PlayerController} from '../../../controller/entity/player_controller';
import {ICellModel} from '../../../interfaces/cell';
import {ItemsCollection} from '../../../collections/items_collection';

/**
 * Class representing single map square(field).
 */
export abstract class Cell extends BaseModel implements ICellModel {
    /**
     * Horizontal position on level grid.
     */
    public x: number;
    /**
     * Vertical position on level grid.
     */
    public y: number;
    /**
     * Entity (monster or player) occupying cell.
     */
    public entity: EntityModel = null;
    /**
     * Array of items in cell.
     */
    public inventory: ItemsCollection = new ItemsCollection();
    /**
     * Boolean variable indicating whether cells display can be changed or not.
     */
    public preventDisplayChange: boolean = false;
    /**
     * Variable indicating if cell was discovered by player (used for purpose of drawing visited but not currently
     * visible cells)
     */
    public wasDiscoveredByPlayer: boolean = false;
    /**
     * Whether confirmation from player is needed before entering cell.
     */
    public confirmMovement: boolean = false;
    /**
     * // TODO write description later
     */
    public displaySet: string = null;
    /**
     * Type of cell.
     */
    public type: string = '';
    /**
     * Initializes cell and fills it with data. Data are imported from {@code cellTypes} object, where constructor parameter is used as key.
     *
     * @param   x       Horizontal position on level grid.
     * @param   y       Vertical position on level grid.
     * @param   config  Object with additional configuration data.
     */
    constructor(x: number, y: number, config: IAnyObject = {}) {
        super();

        this.x = x;
        this.y = y;
        // TODO add initialization of inventory
    }
    /**
     * Whether cell blocks entity movement.
     */
    get blockMovement(): boolean {
        return false;
    }
    /**
     * Whether cell blocks entities line of sight.
     */
    get blocksLos(): boolean {
        return false;
    }
    /**
     * String pointing which sprite should be used as cell display. Must be implemented in sub classes.
     */
    get display(): string {
        throw new Error('Lack of implementation of display property');
    }
    set display(display: string) {
        throw new Error('Lack of implementation of display property');
    }
    /**
     * Message displayed when player walks over cell.
     */
    get walkMessage(): string {
        return '';
    }
    /**
     * Object with properties which are modified in entities who enters this cell.
     */
    get modifiers(): IAnyObject {
        return null;
    }
    /**
     * Resets value entity field of cell model instance (sets it to null).
     */
    public clearEntity(): void {
        this.entity = null;
    }
    /**
     * Sets value of entity field of cell model instance.
     *
     * @param entity    Model of entity
     */
    public setEntity(entity: EntityModel): void {
        this.entity = entity;
    }
    /**
     * Enables possibility to change cell display.
     */
    public enableDisplayChange(): void {
        this.preventDisplayChange = false;
    }
    /**
     * Disables possibility to change cell display.
     */
    public disableDisplayChange(): void {
        this.preventDisplayChange = true;
    }
    /**
     * Changes display of cell.
     *
     * @param   tiles   Array of new tiles names.
     */
    public changeDisplay(tiles: string[]): void {
        if (!this.preventDisplayChange) {
            this.displaySet = tiles.random();
        }
    }
    /**
     * Effect from certain cell while entity walks over it. Default function is below empty function. Can be implemented
     * in child classes.
     */
    public walkEffect(entity?: EntityController): void {
        // do nothing
    }
    /**
     * Method triggered when certain entity (usually player) tries to walk on cell. Default function is below empty
     * function. Can be implemented in child classes.
     */
    public walkAttempt(entity: PlayerController): WalkAttemptResult {
        return new WalkAttemptResult();
    }
    /**
     * Method triggered when certain entity (player included) uses cell. Default function, can be overriden in child
     * classes.
     */
    public useEffect(entity: EntityController): UseEffectResult {
        return new UseEffectResult(false, 'You can\'t activate that.');
    }
    /**
     * Method triggered when certain entity (usually player) tries to use cell. Default function, can be overriden in
     * child classes.
     */
    public useAttempt(entity: EntityController): UseAttemptResult {
        return new UseAttemptResult();
    }
}
