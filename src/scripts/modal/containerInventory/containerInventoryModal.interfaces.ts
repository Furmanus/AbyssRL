import { ItemModel } from '../../items/models/item.model';

export type ContainerInventoryModes = 'put' | 'withdraw';
export interface PlayerSelectionResult {
    items: ItemModel[],
    mode: ContainerInventoryModes,
}
