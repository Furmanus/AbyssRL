import { ModalController } from '../modal.controller';
import { DevFeaturesModalView, DevFormValues } from './devFeaturesModal.view';
import { ModalActions } from '../../constants/game_actions';
import { devFeatureModalTemplate } from './devFeaturesModal.template';
import { DevDungeonModalEvents } from '../../constants/events/devDungeonModalEvents';
import { config } from '../../global/config';
import { Monsters } from '../../entity/constants/monsters';
import { PlayerController } from '../../entity/controllers/player.controller';
import { storeDataInSessionStorage } from '../../utils/storage_helper';
import { SessionStorageKeys } from '../../constants/storage';

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
    this.view.on(
      this,
      DevDungeonModalEvents.SpawnMonster,
      this.onMonsterSpawnInView,
    );
    this.view.on(
      this,
      DevDungeonModalEvents.HealPlayer,
      this.onHealPlayerClickInView,
    );
  }

  protected detachEvents(): void {
    super.detachEvents();

    this.view.off(this, DevDungeonModalEvents.FormSubmitInView);
    this.view.off(this, DevDungeonModalEvents.SpawnMonster);
    this.view.off(this, DevDungeonModalEvents.HealPlayer);
  }

  private onDevDungeonFormSubmitInView(data: DevFormValues): void {
    const {
      devDungeonHeight,
      devDungeonWidth,
      devDungeonLevelType,
      dungeonRoomTypes,
      noMonsters,
    } = data;

    storeDataInSessionStorage(SessionStorageKeys.DevFeatures, data);

    config.LEVEL_WIDTH = parseInt(devDungeonWidth, 10);
    config.LEVEL_HEIGHT = parseInt(devDungeonHeight, 10);
    config.debugOptions.dungeonRooms = Array.isArray(dungeonRoomTypes)
      ? dungeonRoomTypes
      : [dungeonRoomTypes];
    config.debugOptions.noMonsters = noMonsters;
    config.defaultLevelType = devDungeonLevelType || null;

    this.notify(DevDungeonModalEvents.RecreateCurrentLevel);

    this.closeModal();
  }

  private onMonsterSpawnInView(monster: Monsters): void {
    this.notify(DevDungeonModalEvents.SpawnMonster, monster);

    this.view.resetMonsterSpawnSelect();
    this.closeModal();
  }

  private onHealPlayerClickInView(): void {
    const playerController = PlayerController.getInstance();

    playerController.healPlayer();

    this.closeModal();
  }
}
