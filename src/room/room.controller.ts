import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomCreateDto } from './dto/room-create.dto';
import {IRoom} from "./interfaces/IRoom";
import {IAllRooms} from "./interfaces/IAllRooms";

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  async createRoom(@Body() dto: RoomCreateDto): Promise<IRoom> {
    const room: IRoom = await this.roomService.findRoomByName(dto.name);

    if (room) {
      throw new BadRequestException(
        `room with name: ${dto.name} is already exist`,
      );
    }

    return await this.roomService.createRoom(dto);
  }

  @Delete('delete/:Id')
  async deleteRoom(@Param('Id') id: string): Promise<IRoom> {
    const room: IRoom = await this.roomService.findRoomById(id);

    if (!room) {
      throw new BadRequestException(`room with id: ${id} is not exist`);
    }

    return await this.roomService.deleteRoom(id);
  }

  @Get('all')
  async getAllRooms(): Promise<IAllRooms[]> {
    return await this.roomService.getAllRooms();
  }

  @Get('/:Id')
  async getRoomById(@Param('Id') id: string): Promise<IRoom> {
    const room: IRoom = await this.roomService.findRoomById(id);

    if (!room) {
      throw new BadRequestException(`room with id: ${id} is not exist`);
    }

    return room;
  }

  @Put('leave/:RoomId')
  async leaveRoom(
    @Param('RoomId') roomId: string,
    @Body() userId: { userId: string },
  ): Promise<IRoom> {
    const room: IRoom = await this.roomService.findRoomById(roomId);
    if (!room) {
      throw new BadRequestException(`room with id: ${roomId} is not exist`);
    }

    return await this.roomService.leaveRoom(roomId, userId.userId);
  }

  @Post('create/personal')
  async createPersonal(@Body() dto: RoomCreateDto): Promise<IRoom> {
    return await this.roomService.createPersonal(dto);
  }
}
