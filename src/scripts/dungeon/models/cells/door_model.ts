import { Cell, SerializedCell } from './cell_model';
import { WalkAttemptResult } from './effects/walk_attempt_result';
import { UseEffectResult } from './effects/use_effect_result';
import { Entity } from '../../../entity/controllers/entity';
import { ICellModel } from '../../interfaces/cell';
import { UseAttemptResult } from './effects/use_attempt_result';
import { MonstersTypes } from '../../../entity/constants/monsters';

export type SerializedDoor = SerializedCell & {
  areOpen: boolean;
  openDisplay: string;
};

export abstract class DoorModel extends Cell implements ICellModel {
  public areOpen: boolean;
  public closedDisplay: string;
  public openDisplay: string;

  constructor(config: SerializedDoor) {
    super(config);

    if (config) {
      this.areOpen = config.areOpen;
    } else {
      this.areOpen = false;
    }
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

  public useEffect(entityController: Entity): UseEffectResult {
    if (this.areOpen) {
      this.close();

      return new UseEffectResult(
        true,
        `${entityController.getModel().description} closes doors`,
        true,
      );
    }

    this.open();

    return new UseEffectResult(
      true,
      `${entityController.getModel().description} opens doors`,
      true,
    );
  }

  public useAttempt(entity: Entity): UseAttemptResult {
    if (entity.isStunned()) {
      const message = `${entity.getModel().description} ${
        this.areOpen
          ? 'tries to close doors, but fails.'
          : 'tries to open doors, but fails.'
      }`;

      return new UseAttemptResult(false, message, true);
    }

    if (this.areOpen && this.entity) {
      const entityDescription: string = entity.getModel().description;
      const occupyingEntityDescription: string = this.entity.getModel().description;
      const cellDescription: string = this.description;

      return new UseAttemptResult(
        false,
        `${entityDescription} tries to close ${cellDescription}
             but it is blocked by ${occupyingEntityDescription}.`,
        true,
      );
    }

    return new UseAttemptResult(true);
  }

  /**
   * Method triggered when entity attempts to walk on doors.
   */
  public walkAttempt(entityController: Entity): WalkAttemptResult {
    if (!this.areOpen) {
      if (entityController.isStunned()) {
        const message = `${
          entityController.getModel().description
        } bumps into doors.`;

        return new WalkAttemptResult(
          false,
          entityController.getModel().type === MonstersTypes.Player
            ? message
            : null,
        );
      }

      this.open();

      return new WalkAttemptResult(
        false,
        `${entityController.getModel().description} opens doors.`,
      );
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
    }
  }

  /**
   * Method responsible for closing doors. Triggers custom event.
   */
  public close(): void {
    if (this.areOpen) {
      this.areOpen = false;
    }
  }

  public getDataToSerialization(): SerializedDoor {
    return {
      ...super.getDataToSerialization(),
      areOpen: this.areOpen,
      openDisplay: this.openDisplay,
    };
  }
}
