import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { RoomService } from '../room/room.service';
import {IMessage} from "./interfaces/IMessage";
import {IRoom} from "../room/interfaces/IRoom";

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
  ) {}

  @Get('all/:Id')
  async getAllMessage(@Param('Id') id: string): Promise<IMessage[]> {
    const room: IRoom = await this.roomService.findRoomById(id);

    if (!room) {
      throw new BadRequestException(`room with id: ${id} is not exist`);
    }

    return this.messageService.getAllMessagesByRoom(id);
  }

  @Delete('delete/:Id')
  async deleteMessage(@Param('Id') id: string): Promise<IMessage> {
    const message: IMessage = await this.messageService.findMessageById(id);

    if (!message) {
      throw new BadRequestException(`message with id: ${id} is not exist`);
    }

    return this.messageService.deleteMessage(id);
  }
}
