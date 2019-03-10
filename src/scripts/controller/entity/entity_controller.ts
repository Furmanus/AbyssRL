import {calculateFov} from '../../helper/fov_helper';
import {IAnyObject} from '../../interfaces/common';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {EntityModel} from '../../model/entity/entity_model';
import {Controller} from '../controller';

export class EntityController<M extends EntityModel = EntityModel> extends Controller {
    protected model: M;
    /**
     * Constructor for entity controller.
     * @param   config              Object with data for creating model and controller.
     * @param   config.display      Name of sprite visible on game screen.
     * @param   config.position     Starting player position.
     */
    constructor(config: IAnyObject) {
        super();
    }
    /**
     * Moves entity into new cell.
     */
    public move(newCell: Cell): void {
        this.model.lastVisitedCell = this.model.position; // remember on what cell entity was in previous turn
        this.model.position.clearEntity(); // we clear entity field of cell which entity is right now at
        this.model.position = newCell; // we move entity to new position
        /**
         * in new cell model where monster is after movement, we store information about new entity occupying new cell.
         */
        this.model.position.setEntity(this.model);
        newCell.walkEffect(this);
        this.calculateFov();
    }
    public activate(cell: Cell): void {
        const useAttemptResult = cell.useAttempt(this);
        let useEffect;

        if (useAttemptResult.canUse) {
            useEffect = cell.useEffect(this);
        }
    }
    public calculateFov(): void {
        const newFov = calculateFov(this.model);

        this.model.setFov(newFov);
    }
    /**
     * Returns speed of entity (how fast it can take action in time engine).
     */
    public getSpeed(): number {
        return this.getModel().getSpeed();
    }
    /**
     * Returns entity model.
     */
    public getModel(): EntityModel {
        return this.model;
    }
    /**
     * Returns entity field of vision.
     */
    public getFov(): Cell[] {
        return this.model.fov;
    }
    /**
     * Return property value from model.
     */
    /* tslint:disable-next-line:no-any*/
    public getProperty(propertyName: string): any {
        if (!this.model[propertyName]) {
            throw new TypeError(`Uknown property ${propertyName}`);
        }
        return this.model[propertyName];
    }
}
