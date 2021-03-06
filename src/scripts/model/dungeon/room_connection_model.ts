import { RoomModel } from './room_model';
import { BaseModel } from '../../core/base_model';
import { Position } from '../position/position';

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
}
