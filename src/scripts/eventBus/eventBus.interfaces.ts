import { DungeonEventBusEventNames } from './dungeon.eventBus/dungeonEventBus.constants';
import { DungeonEventBusEventDataTypes } from './dungeon.eventBus/dungeonEventBus.interfaces';

export type AllEventBusEventNames = DungeonEventBusEventNames;
export type AllEventBusEventDataTypes = DungeonEventBusEventDataTypes;

export type EventBusCallbackFunction<EventName extends AllEventBusEventNames> = (...args: AllEventBusEventDataTypes[EventName]) => void
