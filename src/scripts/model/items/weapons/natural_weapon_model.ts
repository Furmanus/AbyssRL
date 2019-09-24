import {INaturalWeapon} from '../../../interfaces/combat';
import {Dice} from '../../dice';
import {DamageTypes} from '../../../constants/combat_enums';
import {MonsterAttackTypes} from '../../../constants/monsters';
import {IAnyObject} from '../../../interfaces/common';
import {WearableModel} from '../wearable_model';
import {EntityModel} from '../../entity/entity_model';
import {ItemTypes} from '../../../constants/item';

export class NaturalWeaponModel extends WearableModel implements INaturalWeapon {
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
        super();
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
        return {
            damage: this.damage.getSerializedData(),
            toHit: this.toHit.getSerializedData(),
            type: this.type,
            naturalType: this.naturalType,
        };
    }
    public wear(entity: EntityModel): never {
        throw new Error('Can\'t wear natural weapon');
    }
    public takeoff(entity: EntityModel): never {
        throw new Error('Can\'t take off natural weapon');
    }
    public drop(entity: EntityModel): never {
        throw new Error('Can\'t drop natural weapon');
    }
    public pickup(entity: EntityModel): never {
        throw new Error('Can\'t pick up natural weapon');
    }
}
