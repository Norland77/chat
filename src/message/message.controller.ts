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
import {IMessageController} from "./interfaces/message.controller.interface";
import { IFile } from "./interfaces/IFile";

@Controller('message')
export class MessageController implements IMessageController{
  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
  ) {}

  @Get('images/:Id')
  async getAllImagesByRoom(@Param('Id') id: string): Promise<IFile[]> {
    await this.roomService.findRoomById(id);
    console.log(id)
    return this.messageService.getAllImagesByRoom(id);
  }

  @Get('all/:Id')
  async getAllMessage(@Param('Id') id: string): Promise<IMessage[]> {
    await this.roomService.findRoomById(id);

    return this.messageService.getAllMessagesByRoom(id);
  }

  @Delete('delete/:Id')
  async deleteMessage(@Param('Id') id: string): Promise<IMessage> {
    await this.messageService.findMessageById(id);

    return this.messageService.deleteMessage(id);
  }
}
