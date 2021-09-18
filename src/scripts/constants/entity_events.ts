export enum EntityEvents {
  EntityMove = 'entity:move',
  EntityDeath = 'entity:death',
  EntityHit = 'entity:hit',
  EntityPickedItem = 'entity:pick:item',
  EntityDroppedItem = 'entity:drop:item',
  EntityEquippedWeaponChange = 'entity:equippedWeapon:change',
  EntityEquippedArmourChange = 'entity:equippedArmour:change',
}

export enum EntityInventoryActions {
  PickUp = 'PickUp',
  Equip = 'Equip',
  Drop = 'Drop',
  Use = 'Use',
  Look = 'Look',
}
export enum InventoryModalEvents {
  ChangeInventoryAction = 'ChangeInventoryAction',
  InventoryItemSelected = 'InventoryItemSelected',
  InventoryActionConfirmed = 'InventoryActionConfirmed',
  InventoryModalClosed = 'InventoryModalClosed',
}
