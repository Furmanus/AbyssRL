import { EventBus } from '../eventBus';
import { EntityEventBusEventDataTypes } from './entityEventBus.interfaces';

class EntityEventBus extends EventBus<EntityEventBusEventDataTypes> {}

export const entityEventBus = new EntityEventBus();
