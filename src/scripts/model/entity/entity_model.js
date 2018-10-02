import {entities} from '../../constants/sprites';
import {Observer} from '../../core/observer';

export class EntityModel extends Observer {

    constructor (config) {
        super();
        /**
         * Visible sprite of entity. Member of file constants/sprites.js.
         * @type {string}
         */
        this.display = config.display;
        /**
         * Level model where entity is.
         * @type {LevelModel}
         */
        this.level = config.level;
        /**
         * Cell model where entity is.
         * @type {Cell}
         */
        this.position = config.position;
        /**
         * Cell model where entity was in last turn.
         * @type {Cell}
         */
        this.lastVisitedCell = config.lastVisitedCell || null;
        /**
         * Speed statistic of entity.
         * @type {number}
         */
        this.speed = config.speed;
        /**
         * Perception statistics of entity.
         * @type {number}
         */
        this.perception = config.perception;
        /**
         * Array of cell model which are in entity field of view
         * @type {Array.<Cell>}
         */
        this.fov = [];
        /**
         * Description (usually text to display) of entity.
         * @type {string}
         */
        this.description = 'unknown entity';
    }
    /**
     *
     * @param {Cell}    newCell     New cell which entity will occupy.
     */
    changePosition (newCell) {
        this.position = newCell;
    }
    /**
     * Sets new fov array of entity.
     * @param {Array.<Cell>}    fovArray    Array of cell models in field of view.
     */
    setFov (fovArray) {
        this.fov = fovArray;
        this.notify('property:fov:change', fovArray);
    }
    /**
     *
     * @returns {number}
     */
    getSpeed () {
        return this.speed;
    }
}