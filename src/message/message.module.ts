import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { SocketService } from '../socket/socket.service';
import { RoomModule } from '../room/room.module';
import { UserModule } from "../user/user.module";

@Module({
  providers: [MessageService, MessageRepository, SocketService],
  controllers: [MessageController, MessageRepository],
  exports: [MessageService],
  imports: [RoomModule, UserModule],
})
export class MessageModule {}
