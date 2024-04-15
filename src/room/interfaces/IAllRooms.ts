import {IMessage} from "../../message/interfaces/IMessage";
import {IUser} from "../../user/interfaces/IUser";

export interface IAllRooms {
  messages: IMessage[];
  users: IUser[];
}