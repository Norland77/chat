import {IUser} from "../../user/interfaces/IUser";

export interface IRoom {
  id: string;
  name: string;
  ownerId: string;
  isPrivate: boolean;
  isPersonal: boolean;
  inviteLink: string;
  firstUserId?: string;
  secondUserId?: string;
  users?: IUser[];
}