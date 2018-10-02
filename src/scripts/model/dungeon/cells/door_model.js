import {Cell} from './cell_model';
import {dungeonEvents} from '../../../constants/dungeon_events';
import {WalkAttemptResult} from './walk_attempt_result';
import {UseEffectResult} from './use_effect_result';

export class DoorModel extends Cell {
    /**
     * @typedef DoorModel
     * @constructor
     * @param {number}          x                   Horizontal position on level grid.
     * @param {number}          y                   Vertical position on level grid.
     * @param {Object}          config              Configuration object with additional data.
     * @param {string}          config.type         Type of cell.
     * @param {string}          config.description  Description of cell (visible for example while looking at it).
     * @param {Array.<string>}  config.display      Array with cell types name. They must be equal to keys global tiledata.
     */
    constructor (x, y, config) {
        super(x, y);

        this.areOpen = false;
    }
    get display() {
        return this.areOpen ? this.openDisplay : this.closedDisplay;
    }
    get blockMovement() {
        return !this.areOpen;
    }
    get blockLos() {
        return !this.areOpen;
    }
    get walkMessage() {
        return this.areOpen ? 'You walk through open doorway.' : '';
    }
    useEffect(entityController) {
        if (this.areOpen) {
            this.close();
            return new UseEffectResult(true, `${entityController.getProperty('description')} closes doors`, true);
        }

        this.open();
        return new UseEffectResult(true, `${entityController.getProperty('description')} opens doors`, true);
    }
    /**
     * Method triggered when entity attempts to walk on doors.
     *
     * @param {EntityController}    entityController
     */
    walkAttempt(entityController) {
        if (!this.areOpen) {
            this.open();

            return new WalkAttemptResult(false, `${entityController.getProperty('description')} opens doors.`);
        } else {
            return new WalkAttemptResult(true);
        }
    }
    /**
     * Method responsible for opening doors. Triggers custom event.
     */
    open() {
        if (!this.areOpen) {
            this.areOpen = true;
            this.notify(dungeonEvents.DOORS_OPEN, {
                x: this.x,
                y: this.y
            });
        }
    }
    /**
     * Method responsible for closing doors. Triggers custom event.
     */
    close() {
        if (this.areOpen) {
            this.areOpen = false;
            this.notify(dungeonEvents.DOORS_CLOSED, {
                x: this.x,
                y: this.y
            });
        }
    }
}