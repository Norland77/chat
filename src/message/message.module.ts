import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { SocketService } from '../socket/socket.service';
import { RoomService } from '../room/room.service';
import { RoomModule } from '../room/room.module';

@Module({
  providers: [MessageService, MessageRepository, SocketService],
  controllers: [MessageController, MessageRepository],
  exports: [MessageService],
  imports: [RoomModule],
})
export class MessageModule {}
