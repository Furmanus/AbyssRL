import {RoomModel} from './room_model';

export class RoomConnectionModel {
    public firstRoom: RoomModel;
    public secondRoom: RoomModel;
    public corridor: Position[];

    constructor(firstRoom: RoomModel, secondRoom: RoomModel, corridor: Position[]) {
        this.firstRoom = firstRoom;
        this.secondRoom = secondRoom;
        this.corridor = corridor;
    }
}
