export enum EntityEvents {
    ENTITY_MOVE = 'entity:move',
    ENTITY_DEATH = 'entity:death',
    ENTITY_HIT = 'entity:hit',
    ENTITY_PICKED_ITEM = 'ENTITY_PICKED_ITEM',
    ENTITY_DROPPED_ITEM = 'ENTITY_DROPPED_ITEM',
}

export enum EntityInventoryActions {
    PICK_UP = 'PICK_UP',
    EQUIP = 'EQUIP',
    DROP = 'DROP',
    USE = 'USE',
    LOOK = 'LOOK',
}
export enum InventoryModalEvents {
    CLICK_ACTION_BUTTON = 'CLICK_ACTION_BUTTON',
    INVENTORY_ITEM_SELECTED = 'INVENTORY_ITEM_SELECTED',
}
