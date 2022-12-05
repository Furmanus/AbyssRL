export enum EntityEventBusEventNames {
    EntityMove = 'entity:move',
    EntityHit = 'entity:hit',
    EntityDeath = 'entity:death',
    EntityBloodLoss = 'entity:blood:loss',
    EntityPickItem = 'entity:item:pick',
    EntityDropItem = 'entity:item:drop',
    EntityTakeOffArmour = 'entity:armour:remove',
    EntityWearArmour = 'entity:armour:wear',
    EntityRemoveWeapon = 'entity:weapon:remove',
    EntityWieldsWeapon = 'entity:weapon:wield',
    EntityTransferItemsContainer = 'entity:item:container',
    EntityChangeLevel = 'entity:level:change',
    // PLAYER
    PlayerTurnStart = 'player:turn:start',
    PlayerEndTurn = 'player:turn:end',
}
