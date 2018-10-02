import {Observer} from '../../core/observer';
import {calculateFov} from '../../helper/fov_helper';

export class EntityController extends Observer {
    /**
     * Constructor for entity controller.
     * @param {Object}  config              Object with data for creating model and controller.
     * @param {string}  config.display      Name of sprite visible on game screen.
     * @param {Cell}    config.position     Starting player position.
     * @constructor
     */
    constructor(config) {
        super();
    }
    /**
     * Moves entity into new cell.
     * @param {Cell}    newCell     New target cell which entity will occupy.
     */
    move(newCell) {
        this.model.lastVisitedCell = this.model.position; //remember on what cell entity was in previous turn
        this.model.position.clearEntity(); //we clear entity field of cell which entity is right now at
        this.model.position = newCell; //we move entity to new position
        this.model.position.setEntity(this.model); //in new cell model where monster is after movement, we store information about new entity occupying new cell.
        newCell.walkEffect(this);
        this.calculateFov();
    }
    activate(cell) {
        const useAttemptResult = cell.useAttempt(this);
        let useEffect;

        if (useAttemptResult.canUse) {
            useEffect = cell.useEffect(this);
        }
    }
    calculateFov() {
        const newFov = calculateFov(this.model);

        this.model.setFov(newFov);
    }
    /**
     * Returns speed of entity (how fast it can take action in time engine).
     * @returns {number}
     */
    getSpeed() {
        return this.getModel().getSpeed();
    }
    /**
     *
     * @returns {EntityModel}
     */
    getModel() {
        return this.model;
    }
    /**
     * Return property value from model.
     * @param {string}  propertyName    Name of property
     * @returns {*}
     */
    getProperty(propertyName) {
        if (!this.model[propertyName]) {
            throw new TypeError(`Uknown property ${propertyName}`);
        }
        return this.model[propertyName];
    }
}