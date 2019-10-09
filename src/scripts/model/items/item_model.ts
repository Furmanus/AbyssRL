import {BaseModel} from '../../core/base_model';
import {ItemTypes} from '../../constants/item';
import {IAnyObject} from '../../interfaces/common';
import {globalItemCollection} from '../../global/collections';
import {ItemSprites} from '../../constants/sprites';

export abstract class ItemModel extends BaseModel {
    /**
     * Describes type of item. Different item types can have different own properties.
     */
    public abstract itemType: ItemTypes;
    /**
     * Name of sprite which should be drawn on game canvas.
     */
    public abstract display: ItemSprites;
    /**
     * Description of item, text displayed when examining item, in player or monster inventory, etc.
     */
    public abstract get description(): string;
    /**
     * Returns full description of item along with additional info (damage and damage type for weapons for example).
     */
    public abstract get fullDescription(): string;

    public constructor(config: IAnyObject) {
        super(config);

        globalItemCollection.add(this);
    }
}
