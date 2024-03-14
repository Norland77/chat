export class MessageDto {
  files?: IFiles[];
  text: string;
  roomId: string;
  userId: string;
  username: string;
}

export interface IFiles {
  path?: string;
  name?: string;
  mimetype?: string;
}
