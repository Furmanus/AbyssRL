import { EntityInventoryActions } from './entity_events';

type ActionNameToModalMapType = Record<EntityInventoryActions, string>;

export const actionNameToModalHeaderMap: ActionNameToModalMapType = {
  [EntityInventoryActions.Look]: 'Your current inventory',
  [EntityInventoryActions.Drop]: 'Select items to drop',
  [EntityInventoryActions.PickUp]: 'Select items to pick up',
  [EntityInventoryActions.Use]: 'Select single item to use',
  [EntityInventoryActions.Equip]: 'Select single item to equip',
};
