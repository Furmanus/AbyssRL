import {WearableModel} from './wearable_model';
import {AmuletNames} from '../../constants/weapons';
import {ItemTypes} from '../../constants/item';
import {EntityBodySlots} from '../../constants/monsters';
import {ItemSprites} from '../../constants/sprites';
import {ModifiersModel} from './modifiers_model';

export interface IAmuletConstructorConfig {
    name: AmuletNames;
    modifiers?: ModifiersModel;
}

export class AmuletModel extends WearableModel {
    public readonly name: AmuletNames;
    public readonly itemType: ItemTypes = ItemTypes.AMULET;
    public readonly bodyPart: EntityBodySlots[] = [EntityBodySlots.NECK];
    public readonly display: ItemSprites = ItemSprites.AMULET;

    public get description(): string {
        return this.name;
    }
    public get fullDescription(): string {
        return this.name;
    }

    public constructor(config: IAmuletConstructorConfig) {
        super(config);

        this.name = config.name;
        this.modifiers = config.modifiers;
    }
}
