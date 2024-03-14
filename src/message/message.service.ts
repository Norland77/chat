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

  async findMessageById(id: string) {
    return this.messageRepository.findMessageById(id);
  }

  deleteMessage(id: string) {
    return this.messageRepository.deleteMessage(id);
  }

  editMessage(dto: { id: string; message: { text: string; roomId: string } }) {
    return this.messageRepository.editMessage(dto);
  }
}
