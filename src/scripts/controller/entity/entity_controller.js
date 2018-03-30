import {Observer} from '../../core/observer';

export class EntityController extends Observer{
    /**
     * Constructor for entity controller.
     * @param {Object}  config              Object with data for creating model and controller.
     * @param {string}  config.display      Name of sprite visible on game screen.
     * @param {Cell}    config.position     Starting player position.
     * @constructor
     */
    constructor(config){
        super();
    }
    /**
     * Moves entity into new cell.
     * @param {Cell}    newCell     New target cell which entity will occupy.
     */
    move(newCell){
        this.model.lastVisitedCell = this.model.position; //remember on what cell entity was in previous turn
        this.model.position.clearEntity(); //we clear entity field of cell which entity is right now at
        this.model.position = newCell; //we move entity to new position
        this.model.position.setEntity(this.model); //in new cell model where monster is after movement, we store information about new entity occupying new cell.
    }
    /**
     *
     * @returns {EntityModel}
     */
    getModel(){
        return this.model;
    }
}