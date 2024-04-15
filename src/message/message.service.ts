import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageDto } from './dto/message-create.dto';
import {IFile} from "./interfaces/IFile";
import {MessageEditDto} from "./dto/message-edit.dto";
import {IMessage} from "./interfaces/IMessage";

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async createMessage(dto: MessageDto): Promise<IMessage> {
    let filesInput: IFile[] = [{
      name: '',
      mimetype: '',
      path: '',
    }];
    if (dto.files.length > 0) {
      filesInput = dto.files.map((file: IFile) => ({
        name: file.name,
        path: file.path,
        mimetype: file.mimetype,
      }));
    }

    return await this.messageRepository.createMessage(dto, filesInput);
  }

  async getAllMessagesByRoom(id: string): Promise<IMessage[]> {
    return await this.messageRepository.getAllMessages(id);
  }

  async findMessageById(id: string): Promise<IMessage> {
    return await this.messageRepository.findMessageById(id);
  }

  async deleteMessage(id: string): Promise<IMessage> {
    return await this.messageRepository.deleteMessage(id);
  }

  async editMessage(dto: MessageEditDto): Promise<IMessage> {
    return await this.messageRepository.editMessage(dto);
  }
}
