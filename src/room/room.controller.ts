import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {RoomService} from './room.service';
import {RoomCreateDto} from './dto/room-create.dto';
import {IRoom} from "./interfaces/IRoom";
import {IAllRooms} from "./interfaces/IAllRooms";
import {IRoomController} from "./interfaces/room.controller.interface";

@Controller('room')
export class RoomController implements IRoomController{
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  async createRoom(@Body() dto: RoomCreateDto): Promise<IRoom> {
    await this.roomService.findRoomByName(dto.name);

    return this.roomService.createRoom(dto);
  }

  @Delete('delete/:Id')
  async deleteRoom(@Param('Id') id: string): Promise<IRoom> {
    await this.roomService.findRoomById(id);

    return this.roomService.deleteRoom(id);
  }

  @Get('all')
  async getAllRooms(): Promise<IAllRooms[]> {
    return this.roomService.getAllRooms();
  }

  @Get('/:Id')
  async getRoomById(@Param('Id') id: string): Promise<IRoom> {
    return await this.roomService.findRoomById(id);
  }

  @Put('leave/:RoomId')
  async leaveRoom(
    @Param('RoomId') roomId: string,
    @Body() userId: { userId: string },
  ): Promise<IRoom> {
    await this.roomService.findRoomById(roomId);

    return this.roomService.leaveRoom(roomId, userId.userId);
  }

  @Post('create/personal')
  async createPersonal(@Body() dto: RoomCreateDto): Promise<IRoom> {
    return this.roomService.createPersonal(dto);
  }
}
