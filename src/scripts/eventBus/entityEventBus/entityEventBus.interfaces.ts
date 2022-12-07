import { EntityDamageSource } from '../../combat/combat.interfaces';
import { Cell } from '../../dungeon/models/cells/cell_model';
import { Entity } from '../../entity/entities/entity';
import { EntityDungeonPosition } from '../../entity/models/entity.model';
import { ItemModel } from '../../items/models/item.model';
import { ContainerInventoryModes } from '../../modal/containerInventory/containerInventoryModal.interfaces';
import { EntityEventBusEventNames } from './entityEventBus.constants'

export type EntityEventBusEventDataTypes = {
    [EntityEventBusEventNames.EntityMove]: [Entity, EntityDungeonPosition, EntityDungeonPosition];
    [EntityEventBusEventNames.EntityHit]: [Entity, number, EntityDamageSource?];
    [EntityEventBusEventNames.EntityDeath]: [Entity];
    [EntityEventBusEventNames.EntityBloodLoss]: [Entity];
    [EntityEventBusEventNames.EntityPickItem]: [Entity, ItemModel[] | ItemModel];
    [EntityEventBusEventNames.EntityDropItem]: [Entity, ItemModel[] | ItemModel];
    [EntityEventBusEventNames.EntityTransferItemsContainer]: [Entity, Cell, ItemModel[], ContainerInventoryModes];
    [EntityEventBusEventNames.EntityWearArmour]: [Entity, ItemModel];
    [EntityEventBusEventNames.EntityTakeOffArmour]: [Entity, ItemModel];
    [EntityEventBusEventNames.EntityWieldsWeapon]: [Entity, ItemModel];
    [EntityEventBusEventNames.EntityRemoveWeapon]: [Entity, ItemModel];
    [EntityEventBusEventNames.EntityChangeLevel]: [Entity];
    // PLAYER
    [EntityEventBusEventNames.PlayerTurnStart]: [];
    [EntityEventBusEventNames.PlayerEndTurn]: [];
};
