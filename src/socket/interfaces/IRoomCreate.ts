import { IFile } from "../../message/interfaces/IFile";

export interface IRoomCreate {
  file: IFile
  userId: string;
  name: string;
  isPrivate: boolean;
}