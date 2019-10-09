import {WearableModel} from './wearable_model';
import {Dice} from '../dice';
import {IWeaponConstructorConfig} from '../../interfaces/combat';
import {ItemSprites} from '../../constants/sprites';
import {ItemTypes} from '../../constants/item';

export class WeaponModel extends WearableModel {
    public damage: Dice;
    public toHit: Dice;
    public readonly type: string;
    public readonly name: string;
    public display: ItemSprites;
    public itemType: ItemTypes = ItemTypes.WEAPON;

    get description(): string {
        return this.name;
    }
    public get fullDescription(): string {
        return `${this.description} (${this.damage.getSerializedData()}, ${this.type})`;
    }
    // TODO Think how to solve passing more specific config object type?
    public constructor(config: IWeaponConstructorConfig) {
        super(config);
        const {
            damage,
            toHit,
            name,
            type,
        } = config;

        this.damage = new Dice(damage);
        this.toHit = new Dice(toHit);
        this.type = type;
        this.name = name;
        this.display = ItemSprites.WEAPON;
    }
    /**
     * Returns serialized model data.
     * @returns  Serialized natural weapon model data
     */
    public getSerializedData(): object {
        const serializedParentData = super.getSerializedData();

        return {
            ...serializedParentData,
            damage: this.damage.getSerializedData(),
            toHit: this.toHit.getSerializedData(),
            type: this.type,
            name: this.name,
            display: this.display,
            itemType: this.itemType,
        };
    }
}
