export enum DungeonEvents {
  DoorsOpen = 'cell:doors:open',
  DoorsClosed = 'cell:doors:closed',
  ChangeCurrentLevel = 'change:current:level',
  NewCreatureSpawned = 'NewCreatureSpawned',
  NewEntityStatusSpawned = 'newEntityStatusSpawned',
  NewEntityStatusRemoved = 'newEntityStatusRemoved',
}
export enum DungeonModelEvents {
  CellTypeChanged = 'cell:type:changed',
}
