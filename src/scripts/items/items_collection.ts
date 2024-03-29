import { Collection } from '../core/collection';
import { ItemModel, SerializedItem } from './models/item.model';
import { ItemModelFactory } from './factory/item/itemModel.factory';

export class ItemsCollection extends Collection<ItemModel> {
  public getById(id: string): ItemModel {
    if (id) {
      return this.get().find((item) => item.id === id) || null;
    }

    return null;
  }

  public getFirstItem(): ItemModel {
    return this.get(0);
  }

  public getDataForSerialization(): SerializedItem[] {
    return this.get().map((itemModel) => itemModel.getDataToSerialization());
  }

  public static getInstance(items: ItemModel[] = []): ItemsCollection {
    return new ItemsCollection(items);
  }

  public static getInstanceFromSerializedData(
    items: SerializedItem[] = [],
  ): ItemsCollection {
    return new ItemsCollection(
      items.map((item) => ItemModelFactory.getItemModel(item)),
    );
  }
}
