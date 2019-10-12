import {ItemModel} from './item_model';
import {EntityBodySlots} from '../../constants/monsters';
import {ModifiersModel} from './modifiers_model';

export abstract class WearableModel extends ItemModel {
    public readonly abstract bodyPart: EntityBodySlots[];
    public isEquipped: boolean = false;
    public modifiers?: ModifiersModel = null;
}
