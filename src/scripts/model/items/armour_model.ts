import {WearableModel} from './wearable_model';
import {ItemTypes} from '../../constants/item';
import {ItemSprites} from '../../constants/sprites';
import {ArmourNames} from '../../constants/weapons';

export interface IArmourModelConstructorConfig {
    name: ArmourNames;
    type: ArmourNames;
    protection: number;
    evasion: number;
}

export class ArmourModel extends WearableModel {
    public readonly name: string;
    public readonly type: string;
    public readonly itemType: ItemTypes = ItemTypes.ARMOUR;
    public readonly display: ItemSprites = ItemSprites.ARMOUR;
    public protection: number;
    public evasion: number;

    public get description(): string {
        return this.name;
    }
    public get fullDescription(): string {
        return `${this.name}[${this.evasion},${this.protection}]`;
    }
    constructor(config: IArmourModelConstructorConfig) {
        super(config);

        this.name = config.name;
        this.type = config.type;
        this.protection = config.protection;
        this.evasion = config.evasion;

    }
}
