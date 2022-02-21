import { ItemTypes } from '../../constants/items/item';
import { ItemModel, SerializedItem } from '../../model/items/item_model';
import { ArmourModelFactory } from './armour_model_factory';
import { WeaponModelFactory } from './weapon_model_factory';

export class ItemModelFactory {
  public static getItemModel(item: SerializedItem): ItemModel {
    switch (item.itemType) {
      case ItemTypes.Armour:
        return ArmourModelFactory.getArmourModel(item);
      case ItemTypes.Weapon:
        return WeaponModelFactory.getWeaponModel(item);
    }
  }
}
