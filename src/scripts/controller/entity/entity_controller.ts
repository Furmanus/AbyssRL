import {calculateFov} from '../../helper/fov_helper';
import {IAnyObject} from '../../interfaces/common';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {EntityModel} from '../../model/entity/entity_model';
import {Controller} from '../controller';
import {LevelModel} from '../../model/dungeon/level_model';
import {EntityEvents} from '../../constants/entity_events';
import {boundMethod} from 'autobind-decorator';

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
    protected attachEvents(): void {
        this.model.on(this, EntityEvents.ENTITY_MOVE, this.onEntityPositionChange);
    }
    /**
     * Moves entity into new cell.
     */
    public move(newCell: Cell): void {
        this.model.move(newCell);
    }
    /**
     * Method triggered after position property has been changed in model.
     *
     * @param newCell   New entity position (cell)
     */
    @boundMethod
    public onEntityPositionChange(newCell: Cell): void {
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
     * Returns entity current position (Cell model).
     */
    public getEntityPosition(): Cell {
        return this.model.position;
    }
    /**
     * Changes model information about level and position (cell) where player currently is.
     *
     * @param level         New level where player currently is
     * @param position      New player position (cell)
     */
    public changeLevel(level: LevelModel, position: Cell): void {
        this.model.changeLevel(level);
        this.move(position);
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
