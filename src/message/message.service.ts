import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageDto } from './dto/createMessage.dto';
import {IFile} from "./interfaces/IFile";
import {EditMessageDto} from "./dto/editMessage.dto";

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async createMessage(dto: MessageDto) {
    let filesInput: IFile[] = [{
      name: '',
      mimetype: '',
      path: '',
    }];
    if (dto.files.length > 0) {
      filesInput = dto.files.map((file) => ({
        name: file.name,
        path: file.path,
        mimetype: file.mimetype,
      }));
    }

    return this.messageRepository.createMessage(dto, filesInput);
  }

  async getAllMessagesByRoom(id: string) {
    return this.messageRepository.getAllMessages(id);
  }

  async findMessageById(id: string) {
    return this.messageRepository.findMessageById(id);
  }

  async deleteMessage(id: string) {
    return this.messageRepository.deleteMessage(id);
  }

  async editMessage(dto: EditMessageDto) {
    return this.messageRepository.editMessage(dto);
  }
}
