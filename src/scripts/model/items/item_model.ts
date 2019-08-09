import {BaseModel} from '../../core/base_model';
import {EntityModel} from '../entity/entity_model';

export abstract class ItemModel extends BaseModel {
    public drop(entity: EntityModel): void {
        // placeholder
    }
    public pickup(entity: EntityModel): void {
        // placeholder
    }
}
