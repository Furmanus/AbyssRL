import { EntityController } from '../../entity/controllers/entity.controller';
import { EntityDungeonPosition } from '../../entity/models/entity.model';
import { EntityEventBusEventNames } from './entityEventBus.constants'

export type EntityEventBusEventDataTypes = {
    [EntityEventBusEventNames.EntityMove]: [EntityController, EntityDungeonPosition, EntityDungeonPosition];
}
