import {EntityInventoryActions} from './entity_events';

type ActionNameToModalMapType = {
    [K in EntityInventoryActions]: string;
};

export const actionNameToModalHeaderMap: ActionNameToModalMapType = {
    [EntityInventoryActions.LOOK]: 'Your current inventory',
    [EntityInventoryActions.DROP]: 'Select items to drop',
    [EntityInventoryActions.PICK_UP]: 'Select items to pick up',
    [EntityInventoryActions.USE]: 'Select single item to use',
    [EntityInventoryActions.EQUIP]: 'Select single item to equip',
};
