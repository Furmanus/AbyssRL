import {ICoordinates} from '../interfaces/common';

let fov: ICoordinates[];

export class GlobalPlayerData {
    public static setFov(playerFov: ICoordinates[]): void {
        fov = playerFov;
    }
    public static getFov(): ICoordinates[] {
        return fov;
    }
}
