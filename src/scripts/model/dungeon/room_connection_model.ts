import { RoomModel, SerializedRoom } from './room_model';
import { BaseModel } from '../../core/base_model';
import { Position, SerializedPosition } from '../position/position';

type SerializedRoomConnection = {
  firstRoom: SerializedRoom;
  secondRoom: SerializedRoom;
  corridor: SerializedPosition[];
};

export class RoomConnectionModel extends BaseModel {
  public firstRoom: RoomModel;
  public secondRoom: RoomModel;
  public corridor: Position[];

  constructor(
    firstRoom: RoomModel,
    secondRoom: RoomModel,
    corridor: Position[],
  ) {
    super();

    this.firstRoom = firstRoom;
    this.secondRoom = secondRoom;
    this.corridor = corridor;
  }

  public getDataToSerialization(): SerializedRoomConnection {
    return {
      firstRoom: this.firstRoom.getDataToSerialization(),
      secondRoom: this.secondRoom.getDataToSerialization(),
      corridor: this.corridor.map((pos) => pos.serialize()),
    };
  }
}
