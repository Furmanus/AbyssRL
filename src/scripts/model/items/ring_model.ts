import {WearableModel} from './wearable_model';
import {RingsNames} from '../../constants/weapons';
import {ItemTypes} from '../../constants/item';
import {EntityBodySlots} from '../../constants/monsters';
import {ItemSprites} from '../../constants/sprites';
import {ModifiersModel} from './modifiers_model';

export interface IRingConstructorConfig {
    name: RingsNames;
    modifiers?: ModifiersModel;
}

export class RingModel extends WearableModel {
    public readonly name: RingsNames = RingsNames.RING;
    public readonly itemType: ItemTypes = ItemTypes.RING;
    public readonly bodyPart: EntityBodySlots[] = [EntityBodySlots.FINGER];
    public readonly display: ItemSprites = ItemSprites.RING;

    public get description(): string {
        return this.name;
    }
    public get fullDescription(): string {
        return this.name;
    }

    public constructor(config: IRingConstructorConfig) {
        super(config);

        this.name = config.name;
        this.modifiers = config.modifiers;
    }
}
