import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async createMessage(dto: MessageDto) {
    return this.messageRepository.createMessage(dto);
  }

  async getAllMessagesByRoom(id: string) {
    return this.messageRepository.getAllMessages(id);
  }
}
