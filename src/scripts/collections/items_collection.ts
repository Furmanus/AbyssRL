import { Collection } from './collection';
import { ItemModel } from '../model/items/item_model';

export class ItemsCollection extends Collection<ItemModel> {
  public getFirstItem(): ItemModel {
    return this.get(0);
  }

  public static getInstance(items: ItemModel[] = []): ItemsCollection {
    return new ItemsCollection(items);
  }
}
