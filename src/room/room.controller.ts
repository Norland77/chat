import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';
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

    return this.roomService.createRoom(dto.name);
  }

  @Delete('delete/:Id')
  async deleteRoom(@Param('Id') id: string) {
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
}
