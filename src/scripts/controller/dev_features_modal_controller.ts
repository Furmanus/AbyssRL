import { ModalController } from './modal_controller';
import {
  DevFeaturesModalView,
  DevFormValues,
} from '../view/dev_features_modal_view';
import { ModalActions } from '../constants/game_actions';
import { devFeatureModalTemplate } from '../../templates/dev_features_modal_template';
import { DevDungeonModalEvents } from '../constants/events/devDungeonModalEvents';
import { config } from '../global/config';

const constructorToken = Symbol('Dev features modal controller');
let instance: DevFeaturesModalController;

export class DevFeaturesModalController extends ModalController<DevFeaturesModalView> {
  protected view = new DevFeaturesModalView(devFeatureModalTemplate);

  public constructor(token: symbol) {
    super();

    if (token !== constructorToken) {
      throw new Error('Invalid constructor');
    }
  }

  public static getInstance(): DevFeaturesModalController {
    if (!instance) {
      instance = new DevFeaturesModalController(constructorToken);
    }

    return instance;
  }

  private initializeView(): void {
    const { LEVEL_HEIGHT, LEVEL_WIDTH } = config;

    this.view.setDungeonWidth(String(LEVEL_WIDTH));
    this.view.setDungeonHeight(String(LEVEL_HEIGHT));
  }

  public openModal(): void {
    super.openModal();

    this.view.attachEvents();
    this.initializeView();

    this.notify(ModalActions.OpenModal);
  }

  public closeModal(): void {
    super.closeModal();

    this.view.detachEvents();

    this.notify(ModalActions.CloseModal);
  }

  protected attachEvents() {
    super.attachEvents();

    this.view.on(
      this,
      DevDungeonModalEvents.FormSubmitInView,
      this.onDevDungeonFormSubmitInView,
    );
  }

  protected detachEvents(): void {
    super.detachEvents();

    this.view.off(this, DevDungeonModalEvents.FormSubmitInView);
  }

  private onDevDungeonFormSubmitInView(data: DevFormValues): void {
    const { devDungeonHeight, devDungeonWidth, devDungeonLevelType } = data;

    config.LEVEL_WIDTH = parseInt(devDungeonWidth, 10);
    config.LEVEL_HEIGHT = parseInt(devDungeonHeight, 10);
    config.defaultLevelType = devDungeonLevelType || null;

    this.notify(DevDungeonModalEvents.RecreateCurrentLevel);
  }
}
