import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { SocketService } from '../socket/socket.service';

@Module({
  providers: [MessageService, MessageRepository, SocketService],
  controllers: [MessageController, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
