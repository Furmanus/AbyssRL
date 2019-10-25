import {IModifiersModel, ModifiersModel} from '../../model/items/modifiers_model';

export class ModifiersFactory {
    public static getStatsModifiers(config: IModifiersModel): ModifiersModel {
        return new ModifiersModel(config);
    }
}
