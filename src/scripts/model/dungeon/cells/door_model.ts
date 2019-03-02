import {Cell} from './cell_model';
import {dungeonEvents} from '../../../constants/dungeon_events';
import {WalkAttemptResult} from './effects/walk_attempt_result';
import {UseEffectResult} from './effects/use_effect_result';
import {IAnyObject} from '../../../interfaces/common';
import {EntityController} from '../../../controller/entity/entity_controller';
import {ICellModel} from '../../../interfaces/cell';

export class DoorModel extends Cell implements ICellModel {
    constructor(x: number, y: number, config: IAnyObject) {
        super(x, y);

        this.areOpen = false;
    }
    get display(): string {
        return this.areOpen ? this.openDisplay : this.closedDisplay;
    }
    get blockMovement(): boolean {
        return !this.areOpen;
    }
    get blockLos(): boolean {
        return !this.areOpen;
    }
    get walkMessage(): string {
        return this.areOpen ? 'You walk through open doorway.' : '';
    }
    public useEffect(entityController: EntityController): UseEffectResult {
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
    public walkAttempt(entityController: EntityController): WalkAttemptResult {
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
    public open(): void {
        if (!this.areOpen) {
            this.areOpen = true;
            this.notify(dungeonEvents.DOORS_OPEN, {
                x: this.x,
                y: this.y,
            });
        }
    }
    /**
     * Method responsible for closing doors. Triggers custom event.
     */
    public close(): void {
        if (this.areOpen) {
            this.areOpen = false;
            this.notify(dungeonEvents.DOORS_CLOSED, {
                x: this.x,
                y: this.y,
            });
        }
    }
}
