import { Cell } from './cell_model';
import { DungeonEvents } from '../../../constants/dungeon_events';
import { WalkAttemptResult } from './effects/walk_attempt_result';
import { UseEffectResult } from './effects/use_effect_result';
import { IAnyObject } from '../../../interfaces/common';
import { EntityController } from '../../../controller/entity/entity_controller';
import { ICellModel } from '../../../interfaces/cell';
import { UseAttemptResult } from './effects/use_attempt_result';

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

  get blocksLos(): boolean {
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

  public useAttempt(entity: EntityController): UseAttemptResult {
    if (this.areOpen && this.entity) {
      const entityDescription: string = entity.getProperty('description');
      const occupyingEntityDescription: string = this.entity.description;
      const cellDescription: string = this.description;

      return new UseAttemptResult(false, `${entityDescription} tries to close ${cellDescription}
             but it is blocked by ${occupyingEntityDescription}.`, true);
    }

    return new UseAttemptResult(true);
  }

  /**
     * Method triggered when entity attempts to walk on doors.
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
      this.notify(DungeonEvents.DOORS_OPEN, {
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
      this.notify(DungeonEvents.DOORS_CLOSED, {
        x: this.x,
        y: this.y,
      });
    }
  }
}
