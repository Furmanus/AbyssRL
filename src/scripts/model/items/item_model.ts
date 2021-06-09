import { BaseModel } from '../../core/base_model';
import { EntityModel } from '../entity/entity_model';
import { ItemTypes } from '../../constants/item';

export abstract class ItemModel extends BaseModel {
    /**
     * Describes type of item. Different item types can have different own properties.
     */
    public abstract itemType: ItemTypes;
    /**
     * Name of sprite which should be drawn on game canvas.
     */
    public abstract display: string;
    /**
     * Description of item, text displayed when examining item, in player or monster inventory, etc.
     */
    public abstract get description(): string;
    /**
     * Returns full description of item along with additional info (damage and damage type for weapons for example).
     */
    public abstract get fullDescription(): string;

    public drop(entity: EntityModel): void {
      // placeholder
    }

    public pickup(entity: EntityModel): void {
      // placeholder
    }
}
