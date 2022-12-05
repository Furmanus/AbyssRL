import { ModalController } from '../modal.controller';
import { DevFeaturesModalView, DevFormValues } from './devFeaturesModal.view';
import { ModalActions } from '../../main/constants/gameActions.constants';
import { devFeatureModalTemplate } from './devFeaturesModal.template';
import { DevFeaturesModalConstants } from './devFeaturesModal.constants';
import { config } from '../../global/config';
import { Monsters } from '../../entity/constants/monsters';
import { PlayerEntity } from '../../entity/controllers/player.entity';
import { storeDataInSessionStorage } from '../../utils/storage_helper';
import { SessionStorageKeys } from '../../constants/storage';
import { gameEventBus } from '../../eventBus/gameEventBus/gameEventBus';
import { GameEventBusEventNames } from '../../eventBus/gameEventBus/gameEventBus.constants';

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
      DevFeaturesModalConstants.FormSubmitInView,
      this.onDevDungeonFormSubmitInView,
    );
    this.view.on(
      this,
      DevFeaturesModalConstants.SpawnMonster,
      this.onMonsterSpawnInView,
    );
    this.view.on(
      this,
      DevFeaturesModalConstants.HealPlayer,
      this.onHealPlayerClickInView,
    );
  }

  protected detachEvents(): void {
    super.detachEvents();

    this.view.off(this, DevFeaturesModalConstants.FormSubmitInView);
    this.view.off(this, DevFeaturesModalConstants.SpawnMonster);
    this.view.off(this, DevFeaturesModalConstants.HealPlayer);
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

    gameEventBus.publish(GameEventBusEventNames.RecreateCurrentLevel);

    this.closeModal();
  }

  private onMonsterSpawnInView(monster: Monsters): void {
    gameEventBus.publish(GameEventBusEventNames.SpawnMonster, monster);

    this.view.resetMonsterSpawnSelect();
    this.closeModal();
  }

  private onHealPlayerClickInView(): void {
    const playerController = PlayerEntity.getInstance();

    playerController.healPlayer();

    this.closeModal();
  }
}
