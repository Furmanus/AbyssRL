import {WearableModel} from '../wearable_model';
import {Dice} from '../../dice';
import {IWeaponConstructorConfig} from '../../../interfaces/combat';
import {ItemSprites} from '../../../constants/sprites';

export class WeaponModel extends WearableModel {
    public damage: Dice;
    public toHit: Dice;
    public readonly type: string;
    public readonly name: string;
    public display: string;

    get displayName(): string {
        return this.name;
    }
    // TODO Think how to solve passing more specific config object type?
    public constructor(config: IWeaponConstructorConfig) {
        const {
            damage,
            toHit,
            name,
            type,
        } = config;

        super();

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
    public getDataToSerialization(): string {
        return JSON.stringify({
            damage: this.damage.getSerializedData(),
            toHit: this.toHit.getSerializedData(),
            type: this.type,
            naturalType: this.naturalType,
        });
    }
}
