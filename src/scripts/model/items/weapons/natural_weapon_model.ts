import {Dice} from '../../dice';
import {DamageTypes} from '../../../constants/combat_enums';
import {MonsterAttackTypes} from '../../../constants/monsters';
import {IAnyObject} from '../../../interfaces/common';
import {WearableModel} from '../wearable_model';
import {EntityModel} from '../../entity/entity_model';
import {ItemTypes} from '../../../constants/item';

export class NaturalWeaponModel extends WearableModel {
    public damage: Dice;
    public toHit: Dice;
    public type: DamageTypes;
    public display: string = null;
    public itemType: ItemTypes = null;
    public naturalType: MonsterAttackTypes;

    get description(): string {
        return this.naturalType;
    }
    public get fullDescription(): string {
        return `${this.description} (${this.damage.getSerializedData()}, ${this.type})`;
    }
    // TODO Think how to solve passing more specific config object type?
    public constructor(config: IAnyObject) {
        super(config);
        const {
            damage,
            toHit,
        } = config;

        if (typeof damage === 'string') {
            this.damage = new Dice(damage);
        } else {
            this.damage = damage;
        }
        if (typeof toHit === 'string') {
            this.toHit = new Dice(toHit);
        } else {
            this.toHit = toHit;
        }
        this.type = config.type;
        this.naturalType = config.naturalType;
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
            naturalType: this.naturalType,
        };
    }
}
