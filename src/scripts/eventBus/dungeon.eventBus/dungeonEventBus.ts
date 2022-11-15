import { EventBus } from '../eventBus';
import { DungeonEventBusEventNames } from './dungeonEventBus.constants';

class DungeonEventBus extends EventBus<DungeonEventBusEventNames> {
}

export const dungeonEventBus = new DungeonEventBus();
