import {WearableModel} from '../model/items/wearable_model';
import {ItemModel} from '../model/items/item_model';

export function isWearableItem(item: ItemModel): item is WearableModel {
    return item.isEquipped !== undefined && 'bodyPart' in item;
}
