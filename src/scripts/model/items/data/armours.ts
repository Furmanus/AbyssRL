import {ArmourNames} from '../../../constants/weapons';

interface IArmourConfigObject {
    evasion: number;
    protection: number;
    name: string;
}
interface IArmourData {
    [key: string]: IArmourConfigObject;
}

function getArmourConfig(name: string, evasion: number, protection: number): IArmourConfigObject {
    return {
        name,
        evasion,
        protection,
    };
}

export const armoursData: IArmourData = {
    [ArmourNames.CLOTH_ARMOUR]: getArmourConfig(ArmourNames.CLOTH_ARMOUR, 0, 1),
    [ArmourNames.LEATHER_ARMOUR]: getArmourConfig(ArmourNames.LEATHER_ARMOUR, -1, 2),
    [ArmourNames.SCALE_MAIL]: getArmourConfig(ArmourNames.SCALE_MAIL, -1, 3),
    [ArmourNames.RING_MAIL]: getArmourConfig(ArmourNames.RING_MAIL, -2, 4),
    [ArmourNames.CHAIN_MAIL]: getArmourConfig(ArmourNames.CHAIN_MAIL, -3, 5),
    [ArmourNames.PLATE_MAIL]: getArmourConfig(ArmourNames.PLATE_MAIL, -4, 7),
};
