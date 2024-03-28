export class EditMessageDto {
  id: string
  message: IMessage
}

interface IMessage {
  text: string;
  roomId: string;
}