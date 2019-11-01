import {WearableModel} from '../model/items/wearable_model';
import {ItemModel} from '../model/items/item_model';
import {BaseModel} from '../core/base_model';

export function isWearableItem(item: BaseModel): item is WearableModel {
    return item.isEquipped !== undefined && 'bodyPart' in item;
}
export function isItemModel(item: BaseModel): item is ItemModel {
    return 'itemType' in item;
}
