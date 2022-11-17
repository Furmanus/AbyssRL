import { EventBus } from '../eventBus';
import { DungeonEventBusEventDataTypes } from './dungeonEventBus.interfaces';

class DungeonEventBus extends EventBus<DungeonEventBusEventDataTypes> {}

export const dungeonEventBus = new DungeonEventBus();
