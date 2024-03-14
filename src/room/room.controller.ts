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
import { RoomDto } from './dto/room.dto';
import { PersonalRoomDto } from './dto/personal-room.dto';
/*import { Public } from '../../libs/common/src/decorators';

@Public()*/
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  async createRoom(@Body() dto: RoomDto) {
    const room = await this.roomService.findRoomByName(dto.name);

    if (room) {
      throw new BadRequestException(
        `room with name: ${dto.name} is already exist`,
      );
    }

    return this.roomService.createRoom(dto);
  }

  @Delete('delete/:Id')
  async deleteRoom(@Param('Id') id: string) {
    console.log(id);
    const room = await this.roomService.findRoomById(id);

    if (!room) {
      throw new BadRequestException(`room with id: ${id} is not exist`);
    }

    return this.roomService.deleteRoom(id);
  }

  @Get('all')
  async getAllRooms() {
    return this.roomService.getAllRooms();
  }

  @Get('/:Id')
  async getRoomById(@Param('Id') id: string) {
    const room = await this.roomService.findRoomById(id);

    if (!room) {
      throw new BadRequestException(`room with id: ${id} is not exist`);
    }

    return room;
  }

  @Put('leave/:RoomId')
  async leaveRoom(
    @Param('RoomId') roomId: string,
    @Body() userId: { userId: string },
  ) {
    const room = await this.roomService.findRoomById(roomId);
    console.log(userId);
    if (!room) {
      throw new BadRequestException(`room with id: ${roomId} is not exist`);
    }

    return this.roomService.leaveRoom(roomId, userId.userId);
  }

  @Post('create/personal')
  async createPersonal(@Body() dto: PersonalRoomDto) {
    return this.roomService.createPersonal(dto);
  }
}
