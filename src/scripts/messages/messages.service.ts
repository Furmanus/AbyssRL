import { MessagesView } from './messages.view';
import { config } from '../global/config';
import { entityEventBus } from '../eventBus/entityEventBus/entityEventBus';
import { EntityEventBusEventNames } from '../eventBus/entityEventBus/entityEventBus.constants';
import { Entity } from '../entity/entities/entity';
import { ItemModel } from '../items/models/item.model';
import { Position } from '../position/position';
import { MonstersTypes } from '../entity/constants/monsters';
import { Cell } from '../dungeon/models/cells/cell_model';
import { ContainerInventoryModes } from '../modal/containerInventory/containerInventoryModal.interfaces';
import { CellTypes } from '../dungeon/constants/cellTypes.constants';

const constructorToken = Symbol('MessagesController');
let instance: MessagesService;

export class MessagesService {
  private view: MessagesView;

  constructor(token: symbol) {
    if (token !== constructorToken) {
      throw new Error('Invalid constructor');
    }

    this.view = new MessagesView(
      config.TILE_SIZE * config.ROWS,
      config.SCREEN_HEIGHT - config.TILE_SIZE * config.COLUMNS - 40,
    );

    instance = this;
  }

  public static getInstance(): MessagesService {
    if (instance) {
      return instance;
    }
    instance = new MessagesService(constructorToken);
    instance.initialize();

    return instance;
  }

  public initialize(): void {
    this.attachEvents();
  }

  private attachEvents(): void {
    entityEventBus.subscribe(EntityEventBusEventNames.EntityPickItem, this.onEntityPickUpItems);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityDropItem, this.onEntityDropItems);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityWieldsWeapon, this.onEntityEquipWeapon);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityRemoveWeapon, this.onEntityRemoveWeapon);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityWearArmour, this.onEntityWearArmour);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityTakeOffArmour, this.onEntityRemoveArmour);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityTransferItemsContainer, this.onEntityItemsTransferContainer);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityChangeLevel, this.onEntityLevelChange);
  }

  private onEntityLevelChange = (entity: Entity): void => {
    const { position } = entity.getModel();
    const playerMessage = position.type === CellTypes.StairsDown ? 'You climb upstairs.' : 'You descend downstairs.';
    const otherMessage = position.type === CellTypes.StairsDown
      ? `${entity.getModel().description} appears from downstairs.`
      : `${entity.getModel().description} walks down from stairs.`;

    this.conditionalEntityBasedShowMessage(
      entity,
      playerMessage,
      otherMessage
    );
  }

  private onEntityItemsTransferContainer = (entity: Entity, cell: Cell, items: ItemModel[], mode: ContainerInventoryModes): void => {
    const itemsDescription = items.length > 1 ? `${items.length} items` : items[0].fullDescription;
    const playerMessage = mode === 'put' ? `You put ${itemsDescription} into ${cell.description}.` : `You take ${itemsDescription} from ${cell.description}.`;
    const otherMessage = mode === 'put'
      ? `${entity.getModel().description} puts ${itemsDescription} into ${cell.description}.`
      : `${entity.getModel().description} takes ${itemsDescription} from ${cell.description}.`;

    this.conditionalEntityBasedShowMessage(
      entity,
      playerMessage,
      otherMessage,
    );
  }

  private onEntityPickUpItems = (entity: Entity, items: ItemModel[] | ItemModel): void => {
    const pickedUpItems = Array.isArray(items) ? items : [items];
    const itemDescription = pickedUpItems.length > 1 ? 'several items' : pickedUpItems[0].fullDescription;

    this.conditionalEntityBasedShowMessage(
      entity,
      `You pick up ${itemDescription}.`,
      `${entity.getModel().description} picks up ${itemDescription}.`,
    );
  };

  private onEntityDropItems = (entity: Entity, items: ItemModel[] | ItemModel): void => {
    const droppedItems = Array.isArray(items) ? items : [items];
    const itemDescription = droppedItems.length > 1 ? 'several items' : droppedItems[0].fullDescription;

    this.conditionalEntityBasedShowMessage(
      entity,
      `You drop ${itemDescription}.`,
      `${entity.getModel().description} drops ${itemDescription}.`,
    );
  };

  private onEntityEquipWeapon = (entity: Entity, item: ItemModel): void => {
    this.conditionalEntityBasedShowMessage(
      entity,
      `You wield ${item.fullDescription}.`,
      `${entity.getModel().description} wields ${item.fullDescription}.`,
    );
  }

  private onEntityRemoveWeapon = (entity: Entity, item: ItemModel): void => {
    this.conditionalEntityBasedShowMessage(
      entity,
      `You unwield ${item.fullDescription}.`,
      `${entity.getModel().description} unwields ${item.fullDescription}.`,
    );
  }

  private onEntityWearArmour = (entity: Entity, item: ItemModel): void => {
    this.conditionalEntityBasedShowMessage(
      entity,
      `You equip ${item.fullDescription}.`,
      `${entity.getModel().description} equips ${item.fullDescription}.`,
    );
  }

  private onEntityRemoveArmour = (entity: Entity, item: ItemModel): void => {
    this.conditionalEntityBasedShowMessage(
      entity,
      `You unequip ${item.fullDescription}.`,
      `${entity.getModel().description} unequips ${item.fullDescription}.`,
    );
  }

  private shouldShowMessage(sourcePosition: Position): boolean {
    // TODO sprawdz czy pozycja jest w fov gracza
    return true;
  }

  /**
   * Method responsible for changing size of info screen.
   * @param   newWidth        New width of info screen.
   * @param   newHeight       New height of info screen.
   */
  public changeMessageScreenSize(newWidth: number, newHeight: number): void {
    this.view.changeSize(newWidth, newHeight);
  }

  /**
   * Displays given message in view.
   * @param    message     Message to display.
   */
  public showMessageInView(message: string): void {
    if (message) {
      this.view.addMessage(message);
    }
  }

  /**
   * Removes last displayed message.
   */
  public removeLastMessage(): void {
    this.view.removeLastMessage();
  }

  private conditionalEntityBasedShowMessage(entity: Entity, messageForPlayer: string, messageForNonPlayer: string): void {
    if (entity.getModel().type === MonstersTypes.Player) {
      this.showMessageInView(messageForPlayer);
    } else if (this.shouldShowMessage(entity.getEntityPosition().position)) {
      this.showMessageInView(messageForNonPlayer);
    }
  }
}

export const globalMessagesController = MessagesService.getInstance();
