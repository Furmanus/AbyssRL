import {ItemModel} from './item_model';
import {EntityBodySlots} from '../../constants/monsters';

export abstract class WearableModel extends ItemModel {
    public readonly abstract bodyPart: EntityBodySlots[];
    public isEquipped: boolean = false;
}
