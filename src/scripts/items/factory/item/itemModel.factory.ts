import { ItemTypes } from '../../constants/itemTypes.constants';
import { ItemModel, SerializedItem } from '../../models/item.model';
import { ArmourModelFactory } from './armour_model_factory';
import { WeaponModelFactory } from './weaponModel.factory';

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
