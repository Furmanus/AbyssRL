import {WearableModel} from '../model/items/wearable_model';
import {ItemModel} from '../model/items/item_model';
import {BaseModel} from '../core/base_model';
import {WeaponModel} from '../model/items/weapon_model';
import {ItemTypes} from '../constants/item';
import {ArmourModel} from '../model/items/armour_model';
import {AmuletModel} from '../model/items/amulet_model';
import {RingModel} from '../model/items/ring_model';

export function isWearableItem(item: BaseModel): item is WearableModel {
    return item.isEquipped !== undefined && 'bodyPart' in item;
}
export function isItemModel(item: BaseModel): item is ItemModel {
    return 'itemType' in item;
}
export function isWeaponModel(item: BaseModel): item is WeaponModel {
    return isItemModel(item) && item.itemType === ItemTypes.WEAPON;
}
export function isArmourModel(item: BaseModel): item is ArmourModel {
    return isItemModel(item) && item.itemType === ItemTypes.ARMOUR;
}
export function isAmuletModel(item: BaseModel): item is AmuletModel {
    return isItemModel(item) && item.itemType === ItemTypes.AMULET;
}
export function isRingModel(item: BaseModel): item is RingModel {
    return isItemModel(item) && item.itemType === ItemTypes.RING;
}
