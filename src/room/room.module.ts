import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomRepository } from './room.repository';

@Module({
  providers: [RoomService, RoomRepository],
  controllers: [RoomController, RoomRepository],
})
export class RoomModule {}
